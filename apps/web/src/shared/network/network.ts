export type RequestOptions = Omit<RequestInit, 'method' | 'body'>;

export class Network {
    protected static instance: Network;
    protected baseURL: string = '';
    protected defaultHeaders: HeadersInit = {};

    protected constructor() {}

    public static getInstance() {
        if (!Network.instance) {
            Network.instance = new Network();
        }
        return Network.instance;
    }

    public setBaseURL(url: string): void {
        this.baseURL = url;
    }

    public setDefaultHeaders(headers: HeadersInit): void {
        this.defaultHeaders = headers;
    }

    protected buildURL(url: string): string {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }
        return `${this.baseURL}${url.startsWith('/') ? url : `/${url}`}`;
    }

    public async requestRaw(url: string, options: RequestInit): Promise<Response> {
        const fullURL = this.buildURL(url);

        const requestOptions: RequestInit = {
            ...options,
            headers: {
                ...this.defaultHeaders,
                ...options.headers,
            },
        };

        return fetch(fullURL, requestOptions);
    }

    public async request<T>(url: string, options: RequestInit): Promise<T> {
        const response = await this.requestRaw(url, options);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return response.json();
        }

        return response.text() as unknown as T;
    }

    public async get<T>(url: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(url, {
            ...options,
            method: 'GET',
        });
    }

    public async post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
        return this.request<T>(url, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            ...options,
        });
    }

    public async put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
        return this.request<T>(url, {
            method: 'PUT',
            body: body ? JSON.stringify(body) : undefined,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            ...options,
        });
    }

    public async patch<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
        return this.request<T>(url, {
            method: 'PATCH',
            body: body ? JSON.stringify(body) : undefined,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
            ...options,
        });
    }

    public async delete<T>(url: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(url, {
            ...options,
            method: 'DELETE',
        });
    }

    public async head<T>(url: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(url, {
            ...options,
            method: 'HEAD',
        });
    }

    public async options<T>(url: string, options?: RequestOptions): Promise<T> {
        return this.request<T>(url, {
            ...options,
            method: 'OPTIONS',
        });
    }
}

export const network = Network.getInstance();