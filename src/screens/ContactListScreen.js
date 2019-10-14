import React, { useState, useContext } from 'react';
import { View, ActivityIndicator } from 'react-native';
import {
  ListItem,
  Icon,
  SearchBar,
  Overlay,
  Header,
  Text,
  Button
} from 'react-native-elements';
import { FlatList, NavigationEvents } from 'react-navigation';
import { Context as ContactContext } from '../context/ContactContext';
import Profile from '../components/Profile';
import serverApi from '../api/server';

const ContactListScreen = ({ navigation }) => {
  const { state, fetchContacts, addContact } = useContext(ContactContext);
  const [visibleOverlay, setVisibleOverlay] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [profile, setProfile] = useState(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  const renderItem = item => (
    <ListItem
      title={item.name}
      // subtitle={item.subtitle}
      leftAvatar={{ source: { uri: item.avatar } }}
      bottomDivider
      // go to ChatScreen with the pressed contact's info as param
      onPress={() => navigation.navigate('Chat', { contact: item })}
      chevron
    />
  );

  // function to make a request to search for an existing user via email
  const findContact = async email => {
    try {
      const response = await serverApi.get('/users', {
        params: {
          email: email
        }
      });
      /* return response.data; */
      setProfile(response.data);
    } catch (err) {
      // https://github.com/axios/axios#handling-errors
      setError(err.message);
    }
  };

  const handleAddContact = profile => {
    addContact(profile, state);
    setProfile(null);
    setVisibleOverlay(false);
  };

  // render a contact with options to add it or it doesn't exist
  const renderContactProfile = profile => {
    return isSearching ? (
      <ActivityIndicator size="large" />
    ) : error ? (
      <Text h3 h3Style={{ color: 'red' }}>
        {error}
      </Text>
    ) : profile ? (
      <View>
        <Profile profile={profile} />
        <Button
          title="Add"
          icon={<Icon name="md-add" type="ionicon" size={22} color="white" />}
          onPress={() => handleAddContact(profile)}
        />
      </View>
    ) : null;
  };

  const renderSearchButton = () => {
    return (
      !profile && (
        <Button
          title="Search"
          disabled={input.length === 0}
          // onPress={handleSearch}
          onPress={() => findContact(input)}
          icon={<Icon name="search" type="font-awesome" size={22} />}
        />
      )
    );
  };

  const renderOverlay = () => {
    return (
      <Overlay
        isVisible={visibleOverlay}
        height="auto"
        overlayBackgroundColor="lightcyan"
        onBackdropPress={() => setVisibleOverlay(false)}
      >
        <>
          <SearchBar
            placeholder="Search using a nickname or email..."
            onChangeText={text => setInput(text)}
            value={input}
          />
          {renderSearchButton()}
          {renderContactProfile(profile)}
        </>
      </Overlay>
    );
  };

  return (
    <View>
      <Header
        centerComponent={{ text: 'Contacts' }}
        rightComponent={
          <Icon
            name="md-person-add"
            type="ionicon"
            onPress={() => setVisibleOverlay(true)}
          />
        }
      />
      <NavigationEvents onWillFocus={fetchContacts} />
      <FlatList
        keyExtractor={item => String(item._id)}
        data={state}
        renderItem={({ item }) => renderItem(item)}
      />
      {renderOverlay()}
    </View>
  );
};

// not using header from react nav
ContactListScreen.navigationOptions = {
  header: null
};

export default ContactListScreen;
