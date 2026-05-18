import axios from 'axios';

const searchInstance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_SEARCH_API,
  timeout: 10000,
});

export default {
  get: searchInstance.get,
  post: searchInstance.post,
};
