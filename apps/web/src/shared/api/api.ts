import { Network } from '../network';

interface QueuedRequest {
    url: string;
    options: RequestInit;
    method: string;
    body?: unknown;
    abortController: AbortController; // Internal controller for queue management
    externalSignal: AbortSignal | null; // External signal from user
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
    private getBearerToken: (() => string | null | Promise<string | null>) | null = null;

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

    public setBearerToken(tokenGetter: () => string | null | Promise<string | null>): void {
        this.getBearerToken = tokenGetter;
    }

    /**
     * Creates a combined AbortSignal that aborts when either signal aborts
     */
    private createCombinedSignal(
        internalSignal: AbortSignal,
        externalSignal: AbortSignal | null
    ): AbortSignal {
        if (!externalSignal) {
            return internalSignal;
        }

        // If external signal is already aborted, return it
        if (externalSignal.aborted) {
            return externalSignal;
        }

        // Create a new controller for the combined signal
        const combinedController = new AbortController();

        // Abort combined signal when internal signal aborts
        if (internalSignal.aborted) {
            combinedController.abort();
        } else {
            internalSignal.addEventListener('abort', () => {
                combinedController.abort();
            });
        }

        // Abort combined signal when external signal aborts
        externalSignal.addEventListener('abort', () => {
            combinedController.abort();
        });

        return combinedController.signal;
    }

    private async executeRequest<T>(
        url: string,
        options: RequestInit
    ): Promise<T> {
        // Internal abort controller for queue management
        const internalAbortController = new AbortController();
        
        // Extract external signal if provided
        const externalSignal = options.signal || null;

        // Create combined signal that aborts when either aborts
        const combinedSignal = this.createCombinedSignal(
            internalAbortController.signal,
            externalSignal
        );

        // Get bearer token if token getter is set
        let bearerToken: string | null = null;
        if (this.getBearerToken) {
            const tokenResult = this.getBearerToken();
            bearerToken = tokenResult instanceof Promise ? await tokenResult : tokenResult;
        }

        // Build headers with bearer token if available
        // Convert existing headers to plain object if needed
        const existingHeaders = options.headers instanceof Headers
            ? Object.fromEntries(options.headers.entries())
            : (options.headers || {});
        
        const headers: HeadersInit = {
            ...existingHeaders,
        };
        
        if (bearerToken) {
            (headers as Record<string, string>)['Authorization'] = `Bearer ${bearerToken}`;
        }

        // Remove signal from options since we're using combined signal
        const { signal: _signal, ...optionsWithoutSignal } = options;
        void _signal; // Mark as intentionally unused

        const requestOptions: RequestInit = {
            ...optionsWithoutSignal,
            headers,
            signal: combinedSignal,
        };

        // Extract method from options for queue tracking
        const method = (options.method || 'GET').toUpperCase();

        return new Promise<T>((resolve, reject) => {
            const queuedRequest: QueuedRequest = {
                url,
                options: requestOptions,
                method,
                body: options.body,
                abortController: internalAbortController, // Store internal controller for queue management
                externalSignal, // Store external signal to check if user aborted
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
                    // Check if aborted by external signal (user cancellation)
                    if (error.name === 'AbortError') {
                        // If external signal was aborted, reject immediately (user cancelled)
                        if (queuedRequest.externalSignal?.aborted) {
                            const index = this.requestQueue.indexOf(queuedRequest);
                            if (index > -1) {
                                this.requestQueue.splice(index, 1);
                            }
                            reject(error);
                            return;
                        }
                        // Otherwise, it was aborted by internal controller (for queue management)
                        // Don't remove from queue - we'll retry it
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
        // Filter out requests that were aborted by external signal (user cancelled)
        const requestsToRetry = [...this.requestQueue, ...this.waitingRequests].filter(
            (req) => !req.externalSignal?.aborted
        );
        
        // Reject requests that were cancelled by user
        [...this.requestQueue, ...this.waitingRequests].forEach((request) => {
            if (request.externalSignal?.aborted) {
                request.reject(new Error('Request was aborted by user'));
            } else {
                request.abortController.abort();
            }
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
            // If external signal was aborted (user cancelled), don't retry
            if (request.externalSignal?.aborted) {
                request.reject(new Error('Request was aborted by user'));
                return;
            }

            // Reconstruct request options without the abort signal
            const { signal: _signal, ...optionsWithoutSignal } = request.options;
            void _signal; // Mark as intentionally unused

            // Create new combined signal for retry (with fresh internal controller)
            const retryInternalController = new AbortController();
            const retryCombinedSignal = this.createCombinedSignal(
                retryInternalController.signal,
                request.externalSignal
            );

            // Get fresh bearer token for retry
            let bearerToken: string | null = null;
            if (this.getBearerToken) {
                const tokenResult = this.getBearerToken();
                bearerToken = tokenResult instanceof Promise ? await tokenResult : tokenResult;
            }

            // Update headers with fresh bearer token
            // Convert existing headers to plain object if needed
            const existingHeaders = optionsWithoutSignal.headers instanceof Headers
                ? Object.fromEntries(optionsWithoutSignal.headers.entries())
                : (optionsWithoutSignal.headers || {});
            
            const headers: HeadersInit = {
                ...existingHeaders,
            };
            
            if (bearerToken) {
                (headers as Record<string, string>)['Authorization'] = `Bearer ${bearerToken}`;
            }

            const retryOptions: RequestInit = {
                ...optionsWithoutSignal,
                headers,
                signal: retryCombinedSignal,
            };

            const response = await super.requestRaw(request.url, retryOptions).catch((error) => {
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
