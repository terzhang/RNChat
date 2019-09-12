import React from 'react';
import { View, ImageBackground, Dimensions, StyleSheet } from 'react-native';

/* import { Image } from 'react-native'; */
import { GiftedChat } from 'react-native-gifted-chat';
/* import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; */
import useWebSocket from '../hooks/useWebSocket';
import { Context as MessageContext } from '../context/MessageContext';
import { randomId } from '../helper/createMessageObj';

const id = String(randomId());
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);

const ChatScreen = () => {
  const { state } = React.useContext(MessageContext);
  const [socket] = useWebSocket();

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

  const onSend = (messages = []) => {
    // messages is an array containing an message object
    socket.emit('chat message', messages[0]);
    // emitting a new message object to chat event to websocket.
    // Our own chat event listener pick up the same message and merge it to state
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
