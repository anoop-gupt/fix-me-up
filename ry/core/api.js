import axios from 'axios';

const config = {
  apiProtocol: 'http',
  apiHost: 'api.marksandspencer.com',
  apiKey: 'xiPnaCGXQ0kDlTc6BahQ2naayH9RQDXV,secretkey=b8LpltAxxwIYuaBp',
  timeout: 60000
};

function createRequestOptions() {
  return {
    method: 'get',
    baseURL: `${config.apiProtocol || 'https'}://${config.apiHost}`,
    timeout: config.timeout,
    headers: {
      'Access-Control-Allow-Origin': true,
      Authorization: `MSAuth apikey=${config.apiKey}`
    }
  };
}

function createGeneralRequestOptions() {
  return {
    method: 'get',
    timeout: config.timeout,
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin': true
    }
  };
}

export const get = path => axios.get(path, createRequestOptions());
export const getExt = path => axios.get(path, createGeneralRequestOptions());
