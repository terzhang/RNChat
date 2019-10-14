import React, { useState } from 'react';
/* import { View } from 'react-native'; */
import { Text, Input, Button } from 'react-native-elements';

const AuthForm = ({ onSubmit, submit, signUp, onSignUp, errorMsg }) => {
  const [inputs, setInputs] = useState({ email: '', password: '' });
  return (
    <>
      <Text h1 style={{ alignSelf: 'center' }}>
        {submit}
      </Text>
      <Input
        label="Email"
        autoCapitalization="none"
        autoCorrect={false}
        value={inputs.email}
        onChangeText={text => setInputs({ ...inputs, email: text })}
        errorMessage={errorMsg}
      />
      <Input
        label="Password"
        secureTextEntry={true}
        autoCapitalization="none"
        autoCorrect={false}
        value={inputs.password}
        onChangeText={text => setInputs({ ...inputs, password: text })}
      />
      <Button
        title={submit}
        disabled={inputs.email.length < 3 || inputs.password.length < 3}
        onPress={() =>
          onSubmit({ email: inputs.email, password: inputs.password })
        }
        titleStyle={{ fontWeight: 'bold', fontSize: 30 }}
        containerStyle={{ paddingTop: 20, width: '80%', alignSelf: 'center' }}
      />
      <Button
        title={signUp}
        disabled={inputs.email.length < 3 || inputs.password.length < 3}
        onPress={() =>
          onSignUp({ email: inputs.email, password: inputs.password })
        }
        containerStyle={{ paddingTop: 20, width: '70%', alignSelf: 'center' }}
        buttonStyle={{ backgroundColor: 'mediumaquamarine' }}
      />
    </>
  );
};

export default AuthForm;
