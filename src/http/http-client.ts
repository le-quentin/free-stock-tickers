import axios, {AxiosRequestConfig} from 'axios';

export default () => ({
  get(url: string, config?: AxiosRequestConfig<any>) {
    return axios.get(url, config);
  }
});
