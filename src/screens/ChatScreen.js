import React, { useState } from 'react';
import {
  View,
  ImageBackground,
  Dimensions,
  StyleSheet,
  Text
} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
/* import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; */
import useWebSocket from '../hooks/useWebSocket';
import { Context as MessageContext } from '../context/MessageContext';
import { Context as AuthContext } from '../context/AuthContext';
import { randomId } from '../helper/createMessageObj';
import useDebounce from '../hooks/useDebounce';

const id = String(randomId());
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const ChatScreen = ({ navigation }) => {
  const [input, setInput] = useState('');
  const [usersTyping, setUsersTyping] = useState([]);
  const [typingIndicatorText, setTypingIndicatorText] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const [socket] = useWebSocket();
  const { state, addMessage } = React.useContext(MessageContext);
  const {
    state: { email, userId }
  } = React.useContext(AuthContext);

  /* const [roomId, setRoomId] = useState('');

  React.useEffect(() => {
    const id = navigation.getParam('id', null);
    const roomId = id + '&&' + email;
    socket.emit('joinRoom', {username:email, roomId: roomId});
    // find the contact in state via id
    // state.find(element => {
    //   return element._id === id;
    // });
  }, [navigation, email, socket]); */

  const callbackAfterDebounce = () => {
    if (isTyping) {
      setIsTyping(false);
      // tell other users we've stopped
      socket.emit('isNotTyping', {
        user: email,
        message: 'is not typing...'
      });
      console.log('stopped typing');
    }
  };

  // debounce input whenever input changes
  const [debouncedValue] = useDebounce(input, 1000, callbackAfterDebounce);

  // generate a typing message from the users typing.
  const makeTypingMessage = users => {
    let text = '';
    let separator = '';
    // loop through the userTyping array while its length is less than index and greater than 1.
    for (let i = 0; i < users.length && users.length > 1; i++) {
      // last element in array is concatenated with 'and', otherwise it's a comma.
      separator = i === users.length - 1 ? ' and ' : ', ';
      text = text + separator + users[i];
    }
    // make text if there's actually user(s) typing, otherwise null.
    if (users.length) {
      return text + ' is typing...';
    } else {
      return null;
    }
  };

  // adding listener to the opened socket
  React.useEffect(() => {
    // see ContactContext for the shape of contact.
    const contact = navigation.getParam('contact', null);

    socket.emit('joinRoom', {
      username: email,
      userId,
      contactId: contact._id
    });

    // listen when other users are typing and make indicator text
    socket.on('notifyTyping', data => {
      setUsersTyping([...usersTyping, data.user]); // new user to state
      setTypingIndicatorText(makeTypingMessage(usersTyping));
    });

    // listen to when a user stop typing.
    socket.on('notifyNotTyping', data => {
      // remove user from array by filtering the ones that aren't the user who stopped typing
      const newUsersTyping = usersTyping.filter(user => user != data.user);
      setUsersTyping(newUsersTyping);
      setTypingIndicatorText(makeTypingMessage(newUsersTyping)); // make new typing message
    });

    socket.on('updateRoom', data => {
      console.log('Room Update: ', data);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTextChange = text => {
    // update input state
    setInput(text);
    // debouncedValue will debounce on a delay when input change and ...
    // the delay timer will reset if input change before timer finishes.
    // debouncedValue stops debouncing (catch up to input) after timer finishes.
    if (debouncedValue != input) {
      // if we didn't emit that we're typing, emit it.
      if (!isTyping) {
        console.log('we are typing');
        setIsTyping(true);
        socket.emit('isTyping', { user: email, message: 'is typing...' });
      }
    }
  };

  const onSend = (messages = []) => {
    // save to global state in msg context
    addMessage(messages[0]);
    // messages is an array containing an message object
    socket.emit('chat message', messages[0]);
    // emitting a new message object to chat event to websocket.
    // Our own chat event listener pick up the same message and merge it to state
  };

  const handleChatFooter = () => {
    return <Text>{typingIndicatorText}</Text>;
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../../assets/bg_cat.jpg')}
        style={styles.backgroundContainer}
        imageStyle={styles.image}
        resizeMethod="auto"
      >
        <GiftedChat
          messages={state}
          onSend={messages => onSend(messages)}
          renderChatFooter={handleChatFooter}
          text={input}
          onInputTextChanged={text => handleTextChange(text)}
          user={{
            _id: id,
            name: 'Terry',
            avatar: 'https://placeimg.com/140/140/any'
          }}
        />
      </ImageBackground>
    </View>
  );
};

ChatScreen.navigationOptions = ({ navigation }) => {
  return {
    title: navigation.getParam('contact').name
  };
};

const styles = StyleSheet.create({
  backgroundContainer: { flex: 1, width: screenWidth, height: screenHeight },
  image: { opacity: 0.35, resizeMode: 'stretch' }
});

export default ChatScreen;
