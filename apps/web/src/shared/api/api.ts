import { Network } from '../network';

interface QueuedRequest {
    url: string;
    options: RequestInit;
    method: string;
    body?: unknown;
    abortController: AbortController;
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
}

export class Api extends Network {
    protected static instance: Api;
    private requestQueue: QueuedRequest[] = [];
    private waitingRequests: QueuedRequest[] = [];
    private isRefreshing: boolean = false;
    private refreshPromise: Promise<void> | null = null;
    private onRefresh: (() => Promise<void>) | null = null;

    protected constructor() {
        super();
    }

    public static getInstance(): Api {
        if (!Api.instance) {
            Api.instance = new Api();
        }
        return Api.instance;
    }

    public setRefreshHandler(handler: () => Promise<void>): void {
        this.onRefresh = handler;
    }

    private async executeRequest<T>(
        url: string,
        options: RequestInit
    ): Promise<T> {
        const abortController = new AbortController();

        const requestOptions: RequestInit = {
            ...options,
            signal: abortController.signal,
        };

        // Extract method from options for queue tracking
        const method = (options.method || 'GET').toUpperCase();

        return new Promise<T>((resolve, reject) => {
            const queuedRequest: QueuedRequest = {
                url,
                options: requestOptions,
                method,
                body: options.body,
                abortController,
                resolve: (value: unknown) => resolve(value as T),
                reject,
            };

            // Only add to queue if not already refreshing
            if (!this.isRefreshing) {
                this.requestQueue.push(queuedRequest);
            }

            super
                .requestRaw(url, requestOptions)
                .then(async (response) => {
                    // Check for 401 before processing response
                    if (response.status === 401) {
                        await this.handleUnauthorized(queuedRequest);
                        return;
                    }

                    if (!response.ok) {
                        const index = this.requestQueue.indexOf(queuedRequest);
                        if (index > -1) {
                            this.requestQueue.splice(index, 1);
                        }
                        reject(new Error(`HTTP error! status: ${response.status}`));
                        return;
                    }

                    // Remove from queue on completion
                    const index = this.requestQueue.indexOf(queuedRequest);
                    if (index > -1) {
                        this.requestQueue.splice(index, 1);
                    }

                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        resolve(await response.json());
                    } else {
                        resolve(await response.text() as unknown as T);
                    }
                })
                .catch(async (error) => {
                    // Don't remove from queue if request was aborted (we'll retry it)
                    if (error.name === 'AbortError') {
                        return;
                    }

                    // Remove from queue on error
                    const index = this.requestQueue.indexOf(queuedRequest);
                    if (index > -1) {
                        this.requestQueue.splice(index, 1);
                    }

                    reject(error);
                });
        });
    }

    private async handleUnauthorized(triggeringRequest: QueuedRequest): Promise<void> {
        if (this.isRefreshing) {
            // Add to waiting list and wait for ongoing refresh
            this.waitingRequests.push(triggeringRequest);
            triggeringRequest.abortController.abort();

            if (this.refreshPromise) {
                await this.refreshPromise;
            }

            // Retry after refresh completes
            await this.retryRequest(triggeringRequest);
            return;
        }

        this.isRefreshing = true;

        // Ensure triggering request is in the queue
        const triggeringIndex = this.requestQueue.indexOf(triggeringRequest);
        if (triggeringIndex === -1) {
            this.requestQueue.push(triggeringRequest);
        }

        // Abort all pending requests (including the one that triggered 401)
        const requestsToRetry = [...this.requestQueue, ...this.waitingRequests];
        this.requestQueue.forEach((request) => {
            request.abortController.abort();
        });
        this.waitingRequests.forEach((request) => {
            request.abortController.abort();
        });
        this.requestQueue = [];
        this.waitingRequests = [];

        // Execute refresh if handler is set
        if (this.onRefresh) {
            this.refreshPromise = this.onRefresh();
            try {
                await this.refreshPromise;
            } catch (error) {
                // If refresh fails, reject all queued requests
                requestsToRetry.forEach((request) => {
                    request.reject(error);
                });
                this.isRefreshing = false;
                this.refreshPromise = null;
                return;
            }
        }

        // Retry all aborted requests
        const retryPromises = requestsToRetry.map((request) => this.retryRequest(request));
        await Promise.allSettled(retryPromises);

        this.isRefreshing = false;
        this.refreshPromise = null;
    }

    private async retryRequest(request: QueuedRequest): Promise<void> {
        try {
            // Reconstruct request options without the abort signal
            const { signal: _signal, ...optionsWithoutSignal } = request.options;
            void _signal; // Mark as intentionally unused

            const response = await super.requestRaw(request.url, optionsWithoutSignal).catch((error) => {
                // If fetch itself fails, reject
                throw error;
            });

            if (!response) {
                request.reject(new Error('Failed to get response'));
                return;
            }

            if (response.status === 401) {
                // If we get 401 again after refresh, reject
                request.reject(new Error(`HTTP error! status: ${response.status}`));
                return;
            }

            if (!response.ok) {
                request.reject(new Error(`HTTP error! status: ${response.status}`));
                return;
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                request.resolve(await response.json());
            } else {
                request.resolve(await response.text());
            }
        } catch (error) {
            request.reject(error);
        }
    }

    // Override the request method to add abort controller and refresh policies
    public override async request<T>(url: string, options: RequestInit): Promise<T> {
        // Wait for refresh if it's in progress
        if (this.isRefreshing && this.refreshPromise) {
            await this.refreshPromise;
        }

        return this.executeRequest<T>(url, options);
    }
}

export const api = Api.getInstance();

api.setBaseURL('https://api.example.com');
api.setDefaultHeaders({
    'Content-Type': 'application/json',
});
api.setRefreshHandler(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
});
