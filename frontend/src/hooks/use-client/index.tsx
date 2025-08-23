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
  const baseApiUrl = process.env.NEXT_PUBLIC_BASE_URL;
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

        const responseData: R = data.data || data.message || data;

        return {
          data: responseData,
          status: response.status,
          error: undefined,
        };
      })
      .catch((error) => {
        return {
          data: undefined,
          status: response.status,
          error: error.message || "An error occurred",
        };
      });
  }

  const request = useCallback(
    (method: RequestMethod) => {
      return async function requestHandler<Response, Body, Error>(
        url: string,
        body?: Body,
        options?: ClientRequestOptions
      ) {
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

        return fetch(requestUrl, requestOptions)
          .then((response) => {
            return handleResponse<Response, Error>(response);
          })
          .catch((error: Error) => {
            console.log("error ---", error);
            return { error, status: 500, data: undefined };
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
