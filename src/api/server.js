import axios from 'axios';
import { AsyncStorage } from 'react-native';
import serverUri from '../constants/serverUri';

// create a client connection to the server
const server = axios.create({
  baseURL: serverUri
});

// get jwtoken from storage
const token = AsyncStorage.getItem('token');

// attach Authorization header for all axios requests
// https://github.com/axios/axios#global-axios-defaults
axios.defaults.headers.common['Authorization'] = token;

export default server;
