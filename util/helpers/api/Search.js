import axios from "axios";
import Config from "react-native-config";

const searchInstance = axios.create({baseURL: Config.SEARCH_API, timeout: 10000});

export default {
  get: searchInstance.get,
  post: searchInstance.post,
}
