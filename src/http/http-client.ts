export interface HttpResponse<T = any> {
  data: T,
  status: number
}
export interface HttpInterface {
  get(url: string, config?: any): Promise<HttpResponse<string>>;
}

const defaultHttp = {
  async get(url: string, config?: any): Promise<HttpResponse<string>> {
    const response = await fetch(url, config);
    const data = await response.text();
    return {
      data,
      status: response.status,
    }
  }
}

export class HttpClient {

  private static http: HttpInterface = defaultHttp;

  get(url: string, config?: any) {
    return HttpClient.http.get(url, config);
  }


  // "quick-win" way to do dependency injection here. 
  // Using a DI framework deemed not worth it in this small project
  static use(client: HttpInterface) {
    HttpClient.http = client;
  }
}

export default function () {
  return new HttpClient()
};
