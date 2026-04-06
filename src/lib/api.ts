/**
 * Centralized API utility for making requests to the backend.
 * Handles base URL configuration, common request patterns, and error handling.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

// Request deduplication map
const pendingRequests = new Map<string, Promise<any>>();

export const api = {
  /**
   * Generic fetch wrapper with error handling, timeout, and deduplication.
   * 
   * @param endpoint - API endpoint (e.g., "/api/v1/users")
   * @param options - Fetch options
   * @param timeout - Timeout in milliseconds (default 30s)
   * @returns - Parsed JSON response or Blob for PDFs
   */
  async request(endpoint: string, options: RequestInit = {}, timeout = 30000) {
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;
    
    // Create a unique key for deduplication (only for GET requests by default)
    const isGet = !options.method || options.method.toUpperCase() === "GET";
    const requestKey = `${options.method || "GET"}:${url}:${isGet ? "" : JSON.stringify(options.body)}`;

    if (isGet && pendingRequests.has(requestKey)) {
      return pendingRequests.get(requestKey);
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const requestPromise = (async () => {
      try {
        const isFormData = options.body instanceof FormData;
        
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
          headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...options.headers,
          },
        });

        clearTimeout(id);

        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch (e) {
            errorData = { error: `API Error: ${response.status} ${response.statusText}` };
          }
          throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
        }

        // Handle different content types
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/pdf")) {
          return response.blob();
        }
        
        return response.json();
      } catch (error: any) {
        clearTimeout(id);
        if (error.name === "AbortError") {
          throw new Error("Request Timeout: The server took too long to respond.");
        }
        console.error(`API Request failed for ${url}:`, error);
        throw error;
      } finally {
        if (isGet) {
          pendingRequests.delete(requestKey);
        }
      }
    })();

    if (isGet) {
      pendingRequests.set(requestKey, requestPromise);
    }

    return requestPromise;
  },

  /**
   * GET request.
   * 
   * @param endpoint - API endpoint
   * @param options - Fetch options
   */
  get(endpoint: string, options: RequestInit = {}) {
    return this.request(endpoint, { ...options, method: "GET" });
  },

  /**
   * POST request.
   * 
   * @param endpoint - API endpoint
   * @param body - Request body
   * @param options - Fetch options
   */
  post(endpoint: string, body: any, options: RequestInit = {}) {
    const isFormData = body instanceof FormData;
    return this.request(endpoint, {
      ...options,
      method: "POST",
      body: isFormData ? body : JSON.stringify(body),
    });
  },

  /**
   * PUT request.
   */
  put(endpoint: string, body: any, options: RequestInit = {}) {
    const isFormData = body instanceof FormData;
    return this.request(endpoint, {
      ...options,
      method: "PUT",
      body: isFormData ? body : JSON.stringify(body),
    });
  },

  /**
   * DELETE request.
   */
  delete(endpoint: string, options: RequestInit = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  },
};
