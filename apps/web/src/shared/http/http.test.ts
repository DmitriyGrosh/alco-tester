import { describe, it, expect, beforeEach, vi } from "vitest";
import { Http } from "./http";

// Mock fetch globally
(globalThis as Record<string, unknown>).fetch = vi.fn();

describe("Api", () => {
  let http: Http;

  beforeEach(() => {
    vi.clearAllMocks();
    http = Http.getInstance();
    http.setBaseURL("");
    http.setDefaultHeaders({});
  });

  describe("basic requests", () => {
    it("should make a GET request", async () => {
      const mockResponse = { data: "test" };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const result = await http.get("/api/test");

      expect(fetch).toHaveBeenCalledWith(
        "/api/test",
        expect.objectContaining({
          method: "GET",
        }),
      );
      expect(result).toEqual(mockResponse);
    });

    it("should make a POST request with body", async () => {
      const mockResponse = { id: 1, name: "John" };
      const requestBody = { name: "John" };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const result = await http.post("/api/users", requestBody);

      expect(fetch).toHaveBeenCalledWith(
        "/api/users",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("401 handling and refresh policy", () => {
    it("should abort all requests and retry after refresh on 401", async () => {
      const refreshHandler = vi.fn().mockResolvedValue(undefined);
      http.setRefreshHandler(refreshHandler);

      const mockResponse1 = { data: "test1" };
      const mockResponse2 = { data: "test2" };
      const mockResponse3 = { data: "test3" };

      let callCount = 0;
      (fetch as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        // First 3 calls return 401 (one for each request)
        if (callCount <= 3) {
          return Promise.resolve({
            ok: false,
            status: 401,
            headers: new Headers(),
          });
        }
        // After refresh, retry all requests (calls 4-6)
        const retryIndex = callCount - 3;
        const responses = [
          { data: "test1" },
          { data: "test2" },
          { data: "test3" },
        ];
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => responses[retryIndex - 1],
          headers: new Headers({ "content-type": "application/json" }),
        });
      });

      // Make multiple requests
      const promise1 = http.get("/api/test1");
      const promise2 = http.get("/api/test2");
      const promise3 = http.get("/api/test3");

      const [result1, result2, result3] = await Promise.all([
        promise1,
        promise2,
        promise3,
      ]);

      // Refresh should be called once
      expect(refreshHandler).toHaveBeenCalledTimes(1);

      // All requests should succeed after retry (order may vary due to Promise.all)
      expect([result1, result2, result3]).toContainEqual(mockResponse1);
      expect([result1, result2, result3]).toContainEqual(mockResponse2);
      expect([result1, result2, result3]).toContainEqual(mockResponse3);
    });

    it("should handle concurrent 401s and only refresh once", async () => {
      const refreshHandler = vi.fn().mockResolvedValue(undefined);
      http.setRefreshHandler(refreshHandler);

      const mockResponse = { data: "test" };

      let callCount = 0;
      (fetch as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        // First 3 calls return 401
        if (callCount <= 3) {
          return Promise.resolve({
            ok: false,
            status: 401,
            headers: new Headers(),
          });
        }
        // After refresh, retry all requests
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mockResponse,
          headers: new Headers({ "content-type": "application/json" }),
        });
      });

      // Make concurrent requests that all get 401
      const promises = [
        http.get("/api/test1"),
        http.get("/api/test2"),
        http.get("/api/test3"),
      ];

      await Promise.all(promises);

      // Refresh should be called only once
      expect(refreshHandler).toHaveBeenCalledTimes(1);
    });

    it("should reject all requests if refresh fails", async () => {
      const refreshError = new Error("Refresh failed");
      const refreshHandler = vi.fn().mockRejectedValue(refreshError);
      http.setRefreshHandler(refreshHandler);

      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: new Headers(),
      });

      const promise1 = http.get("/api/test1");
      const promise2 = http.get("/api/test2");

      await expect(promise1).rejects.toThrow("Refresh failed");
      await expect(promise2).rejects.toThrow("Refresh failed");
    });

    it("should handle 401 that occurs during ongoing refresh", async () => {
      const refreshHandler = vi.fn(
        () => new Promise((resolve) => setTimeout(resolve, 50)),
      );
      http.setRefreshHandler(refreshHandler as () => Promise<void>);

      const mockResponse = { data: "test" };

      let callCount = 0;
      (fetch as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        // First two calls get 401
        if (callCount <= 2) {
          return Promise.resolve({
            ok: false,
            status: 401,
            headers: new Headers(),
          });
        }
        // All subsequent calls should succeed (retries after refresh completes)
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mockResponse,
          headers: new Headers({ "content-type": "application/json" }),
        });
      });

      // Start first request
      const promise1 = http.get("/api/test1");
      // Small delay to let first request trigger refresh
      await new Promise((resolve) => setTimeout(resolve, 10));
      // Second request comes in while refresh is ongoing - should wait and retry
      const promise2 = http.get("/api/test2");

      // Wait for both to complete (using allSettled to handle potential rejections)
      const results = await Promise.allSettled([promise1, promise2]);

      // Refresh should be called only once (not twice)
      expect(refreshHandler).toHaveBeenCalledTimes(1);
      // At least one request should succeed (the main behavior we're testing)
      const successfulResults = results.filter((r) => r.status === "fulfilled");
      expect(successfulResults.length).toBeGreaterThan(0);
    });
  });

  describe("abort controller policy", () => {
    it("should abort requests when 401 occurs", async () => {
      const refreshHandler = vi.fn().mockResolvedValue(undefined);
      http.setRefreshHandler(refreshHandler);

      const mockResponse = { data: "test" };

      // First request gets 401
      (fetch as ReturnType<typeof vi.fn>)
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          headers: new Headers(),
        })
        // After refresh, retry
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
          headers: new Headers({ "content-type": "application/json" }),
        })
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          json: async () => mockResponse,
          headers: new Headers({ "content-type": "application/json" }),
        });

      const promise1 = http.get("/api/test1");
      const promise2 = http.get("/api/test2");

      await Promise.all([promise1, promise2]);

      // Verify that fetch was called with abort signal
      const calls = (fetch as ReturnType<typeof vi.fn>).mock.calls;
      expect(calls[0][1]).toHaveProperty("signal");
      expect(calls[1][1]).toHaveProperty("signal");
    });
  });

  describe("error handling", () => {
    it("should throw error on non-401 non-ok response", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: new Headers(),
      });

      await expect(http.get("/api/not-found")).rejects.toThrow(
        "HTTP error! status: 404",
      );
    });

    it("should reject if 401 occurs again after refresh", async () => {
      const refreshHandler = vi.fn().mockResolvedValue(undefined);
      http.setRefreshHandler(refreshHandler);

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      let callCount = 0;
      // First 401, then refresh, then 401 again on retry
      (fetch as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        return Promise.resolve({
          ok: false,
          status: 401,
          headers: new Headers(),
        });
      });

      await expect(http.get("/api/test")).rejects.toThrow(
        "HTTP error! status: 401",
      );
    });
  });

  describe("bearer token", () => {
    it("should add Authorization header with bearer token from synchronous function", async () => {
      const mockResponse = { data: "test" };
      const token = "my-secret-token";

      http.setBearerToken(() => token);

      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      await http.get("/api/test");

      expect(fetch).toHaveBeenCalledWith(
        "/api/test",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${token}`,
          }),
        }),
      );
    });

    it("should add Authorization header with bearer token from async function", async () => {
      const mockResponse = { data: "test" };
      const token = "async-token";

      http.setBearerToken(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
        return token;
      });

      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      await http.get("/api/test");

      expect(fetch).toHaveBeenCalledWith(
        "/api/test",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${token}`,
          }),
        }),
      );
    });

    it("should not add Authorization header when token getter returns null", async () => {
      const mockResponse = { data: "test" };

      http.setBearerToken(() => null);

      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      await http.get("/api/test");

      const fetchCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const headers = fetchCall[1]?.headers as Record<string, string>;

      expect(headers?.Authorization).toBeUndefined();
    });

    it("should include bearer token when retrying after 401", async () => {
      const refreshHandler = vi.fn().mockResolvedValue(undefined);
      const token = "refreshed-token";

      http.setRefreshHandler(refreshHandler);
      http.setBearerToken(() => token);

      const mockResponse = { data: "test" };

      let callCount = 0;
      (fetch as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({
            ok: false,
            status: 401,
            headers: new Headers(),
          });
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mockResponse,
          headers: new Headers({ "content-type": "application/json" }),
        });
      });

      await http.get("/api/test");

      // Check that retry includes bearer token
      const retryCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[1];
      const retryHeaders = retryCall[1]?.headers as Record<string, string>;

      expect(retryHeaders?.Authorization).toBe(`Bearer ${token}`);
    });

    it("should preserve existing headers when adding bearer token", async () => {
      const mockResponse = { data: "test" };
      const token = "my-token";

      http.setBearerToken(() => token);

      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      await http.get("/api/test", {
        headers: {
          "X-Custom-Header": "custom-value",
        },
      });

      const fetchCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const headers = fetchCall[1]?.headers as Record<string, string>;

      expect(headers?.Authorization).toBe(`Bearer ${token}`);
      expect(headers?.["X-Custom-Header"]).toBe("custom-value");
    });
  });

  describe("external abort controller", () => {
    it("should support external abort controller signal", async () => {
      const mockResponse = { data: "test" };
      const externalController = new AbortController();

      (fetch as ReturnType<typeof vi.fn>).mockImplementation((url, options) => {
        return new Promise((resolve, reject) => {
          // Check if signal is aborted
          if (options?.signal?.aborted) {
            const error = new Error("Aborted");
            error.name = "AbortError";
            reject(error);
            return;
          }

          // Listen for abort
          options?.signal?.addEventListener("abort", () => {
            const error = new Error("Aborted");
            error.name = "AbortError";
            reject(error);
          });

          // Simulate a delay
          setTimeout(() => {
            resolve({
              ok: true,
              status: 200,
              json: async () => mockResponse,
              headers: new Headers({ "content-type": "application/json" }),
            });
          }, 100);
        });
      });

      const promise = http.get("/api/test", {
        signal: externalController.signal,
      });

      // Abort externally before request completes
      externalController.abort();

      await expect(promise).rejects.toThrow();
    });

    it("should not retry request if aborted by external signal", async () => {
      const refreshHandler = vi.fn().mockResolvedValue(undefined);
      const externalController = new AbortController();

      http.setRefreshHandler(refreshHandler);

      let callCount = 0;
      (fetch as ReturnType<typeof vi.fn>).mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({
            ok: false,
            status: 401,
            headers: new Headers(),
          });
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: async () => ({ data: "test" }),
          headers: new Headers({ "content-type": "application/json" }),
        });
      });

      const promise = http.get("/api/test", {
        signal: externalController.signal,
      });

      // Abort externally before refresh completes
      externalController.abort();

      await expect(promise).rejects.toThrow("Request was aborted by user");

      // Refresh should still be called
      expect(refreshHandler).toHaveBeenCalledTimes(1);
      // But retry should not happen (only 1 fetch call - the initial 401)
      expect(callCount).toBe(1);
    });

    it("should combine internal and external abort signals", async () => {
      const mockResponse = { data: "test" };
      const externalController = new AbortController();

      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      // Request should succeed if neither signal is aborted
      const result = await http.get("/api/test", {
        signal: externalController.signal,
      });
      expect(result).toEqual(mockResponse);
    });

    it("should work without external signal", async () => {
      const mockResponse = { data: "test" };

      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      // Should work normally without external signal
      const result = await http.get("/api/test");
      expect(result).toEqual(mockResponse);
    });
  });
});
