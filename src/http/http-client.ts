export interface HttpResponse<T = any> {
  data: T,
  status: number
}
export interface HttpClient {
  get(url: string, config?: any): Promise<HttpResponse<string>>;
}

export class FetchHttpClient implements HttpClient {
  async get(url: string, config?: any): Promise<HttpResponse<string>> {
    const response = await fetch(url, config);
    const data = await response.text();
    return {
      data,
      status: response.status,
    }
  }
}

let staticClient = new FetchHttpClient();
export class HttpClientStaticProxy implements HttpClient {
  get(...args: any[]) {
    return (staticClient.get as any)(...args);
  }
}

export function use(client: HttpClient) {
  staticClient = client;
}

export default function () {
  return new HttpClientStaticProxy();
};

