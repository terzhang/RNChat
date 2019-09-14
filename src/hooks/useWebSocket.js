import React from 'react';
import { YellowBox } from 'react-native';
import io from 'socket.io-client';
import { Context as MessageContext } from '../context/MessageContext';
import { Context as AuthContext } from '../context/AuthContext';
import serverUri from '../constants/serverUri';

// weird yellowbox bug
YellowBox.ignoreWarnings([
  'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

// custom hook that uses web sockets
const useWebSocket = (event = 'chat message') => {
  const { state } = React.useContext(AuthContext);

  // connect to socket.io backend through ngrok
  const [socket, setSocket] = React.useState(
    io(
      serverUri /* , {
      transportOptions: {
        polling: {
          extraHeaders: {
            Authorization: `Bearer ${state.token}`
          }
        }
      }
    } */
    )
  );

  const { addMessage } = React.useContext(MessageContext);

  React.useEffect(() => {
    socket.on('connect', () => {
      console.log('connection to socket server: ONLINE');
    });

    // define a listener to the messages emitted through the event
    // and define a callback for the messages that comes through from event
    socket.on(event, msg => {
      // TODO: implement a better json object validation
      // merge the new message onto the message array in global state
      console.log('received ', msg);
      addMessage(msg);
    });

    socket.on('disconnect', () => {
      console.log('connection to socket server: LOST.');
    });

    return () => {
      socket.close();
    }; // clean up on unmount
    // ! this side effect must only be called once. So much frustrating figuring why it kept reconnecting or disconnecting.  >_<
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [socket];
};

export default useWebSocket;
