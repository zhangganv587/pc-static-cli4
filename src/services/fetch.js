// 分账模块
import Axios from 'axios';
import Config from './config';

const fetch = (params, url, Config[baseUrlName], type = 'post') => {
  if (type === 'post') {
    Axios.post(`${Config[baseUrlName]}${url}`, { condition: { ...params } }).then(res => res.data);
  } else if (type === 'get') {
    Axios.get(`${baseUrl}${url}`, {}).then(res => res.data);
  }
};

export default fetch;
