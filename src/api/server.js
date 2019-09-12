import axios from 'axios';
import { AsyncStorage } from 'react-native';

// create a client connection to the server
const server = axios.create({
  baseURL: 'http://68558e00.ngrok.io' // change this before deployment
});

// get jwtoken from storage
const token = AsyncStorage.getItem('token');

// attach Authorization header for all axios requests
// https://github.com/axios/axios#global-axios-defaults
axios.defaults.headers.common['Authorization'] = token;

export default server;
