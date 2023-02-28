import {AxiosRequestConfig, AxiosResponse, default as defaultAxios} from 'axios';

export interface AxiosInterface {
  get(url: string, config?: AxiosRequestConfig<any>): Promise<AxiosResponse>;
}

export class HttpClient {

  private static axios: AxiosInterface = defaultAxios;

  get(url: string, config?: AxiosRequestConfig<any>) {
    return HttpClient.axios.get(url, config);
  }


  // "quick-win" way to do dependency injection here. 
  // Using a DI framework deemed not worth it in this small project
  static use(axios: AxiosInterface) {
    HttpClient.axios = axios;
  }
}

export default function () {
  return new HttpClient()
};
