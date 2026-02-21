export type RequestContext = {
  url: string;
  options: RequestInit;
};

export type RequestMiddleware = (ctx: RequestContext) => Promise<RequestContext>;
export type ResponseMiddleware = (
  response: Response,
  ctx: RequestContext,
  retry: () => Promise<Response>
) => Promise<Response>;

export class ApiClient {
  private requestMiddlewares: RequestMiddleware[] = [];
  private responseMiddlewares: ResponseMiddleware[] = [];
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  useRequestMiddleware(mw: RequestMiddleware) {
    this.requestMiddlewares.push(mw);
  }

  useResponseMiddleware(mw: ResponseMiddleware) {
    this.responseMiddlewares.push(mw);
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    let ctx: RequestContext = {
      url: `${this.baseUrl}${endpoint}`,
      options: {
        headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
        ...options,
      },
    };

    // Apply request middlewares
    for (const mw of this.requestMiddlewares) {
      ctx = await mw(ctx);
    }

    const execute = async () => fetch(ctx.url, ctx.options);

    let response = await execute();

    // Apply response middlewares
    for (const mw of this.responseMiddlewares) {
      response = await mw(response, ctx, execute);
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw error;
    }

    return response.json();
  }
}
