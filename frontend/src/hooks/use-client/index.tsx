"use client";

import { useCallback } from "react";
import {
  ClientRequestOptions,
  RequestMethod,
  RequestOptions,
} from "@/interfaces";
import { getSession, logout } from "@/actions-server";
import { toast } from "react-hot-toast";

export const useClient = () => {
  // Use environment variable or fallback to localhost for development
  const baseApiUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:4001"
      : undefined);
  const generateAuthHeader = useCallback((token?: string) => {
    const isLoggedIn = !!token;
    if (isLoggedIn) {
      return { Authorization: `Bearer ${token}` };
    } else {
      return {};
    }
  }, []);

  async function handleResponse<R, E>(response: globalThis.Response) {
    return response
      .json()
      .then((data) => {
        if (!response.ok) {
          // Handle 401 Unauthorized - log out user
          if (response.status === 401) {
            toast.error("Session expired. Please log in again.");
            logout();
            return {
              error: "Session expired. Please log in again.",
              status: response.status,
              data: undefined,
            };
          }
          const error: E = (data && data.message) || response.statusText;
          return {
            error,
            status: response.status,
            data: undefined,
          };
        }

        const responseData: R = data || data.message || data;

        return {
          data: responseData,
          status: response.status,
          error: undefined,
        };
      })
      .catch((error: unknown) => {
        return {
          data: undefined,
          status: response.status,
          error: (error instanceof Error ? error.message : "An error occurred") as E,
        };
      });
  }

  const request = useCallback(
    (method: RequestMethod) => {
      return async function requestHandler<Response, Body, ErrorType>(
        url: string,
        body?: Body,
        options?: ClientRequestOptions
      ) {
        // Validate base URL if not overriding
        if (!options?.overrideDefaultBaseUrl && !baseApiUrl) {
          const errorMessage =
            "API base URL is not configured. Please set NEXT_PUBLIC_BASE_URL in your environment variables.";
          console.error(errorMessage);
          toast.error("Configuration error: API URL not set");
          return {
            error: errorMessage as unknown as ErrorType,
            status: 500,
            data: undefined,
          };
        }

        const tokenToUse = options?.token?.token || (await getSession()).token;
        const authHeaders = generateAuthHeader(tokenToUse);

        const requestOptions: RequestOptions = {
          method,
          headers: {
            "Content-Type": "application/json",
            "Accept-Language": "en-US",
            ...(authHeaders.Authorization && {
              Authorization: authHeaders.Authorization,
            }),
            ...options?.headers,
          },
        };

        if (body) {
          requestOptions.headers["Content-Type"] = "application/json";
          requestOptions.body = JSON.stringify(body);
        }

        const hideSlash = url.startsWith("/");
        const baseUrl = options?.overrideDefaultBaseUrl
          ? ""
          : baseApiUrl + (hideSlash ? "" : "/");
        const requestUrl = `${baseUrl}${url}`;

        // Validate the constructed URL
        try {
          new URL(requestUrl);
        } catch (urlError) {
          const errorMessage = `Invalid API URL: ${requestUrl}. Please check your NEXT_PUBLIC_BASE_URL configuration.`;
          console.error(errorMessage, urlError);
          toast.error("Invalid API configuration");
          return {
            error: errorMessage as unknown as ErrorType,
            status: 500,
            data: undefined,
          };
        }

        return fetch(requestUrl, requestOptions)
          .then((response) => {
            return handleResponse<Response, ErrorType>(response);
          })
          .catch((error: unknown) => {
            const errorMessage =
              error instanceof Error && error.message === "Failed to fetch"
                ? `Network error: Unable to connect to ${baseUrl || "API server"}. Please check if the server is running and CORS is configured correctly.`
                : error instanceof Error
                ? error.message
                : "An error occurred while making the request";
            console.error("Request failed:", {
              url: requestUrl,
              method,
              error: errorMessage,
              originalError: error,
            });
            toast.error("Request failed. Please try again.");
            return {
              error: errorMessage as unknown as ErrorType,
              status: 500,
              data: undefined,
            };
          });
      };
    },
    [baseApiUrl, generateAuthHeader]
  );

  return {
    get: request("GET"),
    post: request("POST"),
    put: request("PUT"),
    delete: request("DELETE"),
    patch: request("PATCH"),
  };
};
