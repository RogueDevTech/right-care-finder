export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface PrefixType {
  [name: string]: string;
}

export interface RequestOptions {
  method: RequestMethod;
  headers: PrefixType;
  body?: string;
}

export interface Token {
  token: string;
}

export interface ClientRequestOptions {
  overrideDefaultBaseUrl?: boolean;
  headers?: PrefixType;
  token?: Token;
  redirectIfUnauthorized?: boolean;
}

export type ClientResponse<T = unknown, E = unknown> =
  | {
      data: T;
      status: number;
    }
  | {
      error: E;
      status: number;
    };
