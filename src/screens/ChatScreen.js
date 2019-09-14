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

const ChatScreen = () => {
  const [input, setInput] = useState('');
  const [usersTyping, setUsersTyping] = useState([]);
  const [typingIndicatorText, setTypingIndicatorText] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [debouncedValue] = useDebounce(input, 500); // debounce input whenever input changes
  const { state, addMessage } = React.useContext(MessageContext);
  const [socket] = useWebSocket();
  const {
    state: { email }
  } = React.useContext(AuthContext);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTextChange = text => {
    setInput(text);
    // tell socket we're typing while input text is newer
    // if input text is newer means text is debouncing in a delay
    if (debouncedValue != text) {
      // if we didn't emit that we're typing, emit it.
      if (!isTyping) {
        setIsTyping(true);
        socket.emit('isTyping', () => {
          return { user: email, message: 'is typing...' };
        });
      }
    } else {
      // once the text finishes debouncing and catch up with input text...
      // we've stopped typing
      setIsTyping(false);
      // tell other users we've stopped
      socket.emit('isNotTyping', () => {
        return { user: email, message: 'is not typing...' };
      });
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
    title: navigation.getParam('user').name
  };
};

const styles = StyleSheet.create({
  backgroundContainer: { flex: 1, width: screenWidth, height: screenHeight },
  image: { opacity: 0.35, resizeMode: 'stretch' }
});
export default ChatScreen;

/* React.useEffect(() => {
    const id = navigation.getParam('id', null);
    console.log(id);

    // find the contact in state via id
    state.find(element => {
      return element._id === id;
    });
  }, [navigation, state]); */

/* React.useEffect(() => {
    socket.connect();
  }, []); */
