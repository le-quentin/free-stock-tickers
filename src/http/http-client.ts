import {AxiosRequestConfig, AxiosResponse, default as defaultAxios} from 'axios';

export interface HttpResponse<T> {
  data: T,
  status: number
}
export interface HttpInterface {
  get<T=string>(url: string, config?: any): Promise<HttpResponse<T>>;
}

export class HttpClient {

  private static http: HttpInterface = defaultAxios;

  get(url: string, config?: any) {
    return HttpClient.http.get(url, config);
  }


  // "quick-win" way to do dependency injection here. 
  // Using a DI framework deemed not worth it in this small project
  static use(axios: HttpInterface) {
    HttpClient.http = axios;
  }
}

export default function () {
  return new HttpClient()
};
