import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'http://192.168.1.4:3030/api',
});
