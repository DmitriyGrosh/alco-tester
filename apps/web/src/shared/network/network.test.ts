import { describe, it, expect, beforeEach, vi } from "vitest";
import { network } from "./network";

// Mock fetch globally
(globalThis as Record<string, unknown>).fetch = vi.fn();

describe("Network", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    network.setBaseURL("");
    network.setDefaultHeaders({});
  });

  describe("get", () => {
    it("should make a GET request", async () => {
      const mockResponse = { data: "test" };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const result = await network.get("/api/test");

      expect(fetch).toHaveBeenCalledWith(
        "/api/test",
        expect.objectContaining({
          method: "GET",
        }),
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe("post", () => {
    it("should make a POST request with body", async () => {
      const mockResponse = { id: 1, name: "John" };
      const requestBody = { name: "John" };
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
        headers: new Headers({ "content-type": "application/json" }),
      });

      const result = await network.post("/api/users", requestBody);

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

  describe("baseURL", () => {
    it("should prepend baseURL to relative URLs", async () => {
      network.setBaseURL("https://api.example.com");
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
        headers: new Headers({ "content-type": "application/json" }),
      });

      await network.get("/users");

      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/users",
        expect.any(Object),
      );
    });

    it("should not modify absolute URLs", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
        headers: new Headers({ "content-type": "application/json" }),
      });

      await network.get("https://external-api.com/data");

      expect(fetch).toHaveBeenCalledWith(
        "https://external-api.com/data",
        expect.any(Object),
      );
    });
  });

  describe("error handling", () => {
    it("should throw error on non-ok response", async () => {
      (fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 404,
        headers: new Headers(),
      });

      await expect(network.get("/api/not-found")).rejects.toThrow(
        "HTTP error! status: 404",
      );
    });
  });
});
