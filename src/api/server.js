import axios from 'axios';
import serverUri from '../constants/serverUri';

// create a client connection to the server
const server = axios.create({
  baseURL: serverUri
});

// Export a method to set the default token for all authorization for this server connection
// attach Authorization header for all axios requests
// https://github.com/axios/axios#global-axios-defaults
export const setAuthToken = token => {
  server.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

/* server.defaults.headers.common['Authorization'] = `Bearer ${token}`; */

export default server;
