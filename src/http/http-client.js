import axios from 'axios';

export default () => ({
  get(...args) {
    return axios.get(...args);
  }
});
