import React, { useEffect, useState } from 'react';
import { SafeAreaView, Image, StyleSheet } from 'react-native';
import useApiCall from '../Hooks/useApiCall';
import { POST } from '../Config/URLs';
import useAuth from '../Hooks/useAuth';
import { restoreToken } from '../actions/restoreAction';
import { connect } from 'react-redux';
import { Text } from 'react-native-elements';
import Button from '../components/Elements/Button';
import Input from '../components/Elements/Inputs/TextInput';
import Logo from '../components/Logo';

const Login = ({ restoreToken, localAuth }) => {
  const [{ data, loading, error }, doFetch] = useApiCall();
  const [{ authed, isLoading, token }, { setAuth, loadAuth }] = useAuth();

  const [state, setState] = useState({
    email: '',
    password: '',
    hidePassword: true,
  });

  // load local storage token
  useEffect(() => {
    loadAuth();
    // set token in the redux store if there is one loaded from local storage
    // if not authed still update state to toggle isLoading
    restoreToken(authed ? token : null);
  }, []);

  useEffect(() => {
    if (data.access_token) {
      setAuth(data.access_token, data.token_type, data.expires_at);
    }

    if (authed) {
      restoreToken(data.access_token);
    }
  }, [data, authed]);

  const onChange = (name, value) => {
    setState({ ...state, [name]: value });
  };

  const onSubmit = async () => {
    doFetch('login', { params: { ...state }, method: POST });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Logo />
      <Input
        addShadow={true}
        label="Email"
        value={state.email}
        autoCapitalize="none"
        onChange={(value) => onChange('email', value)}
        errorMessage={!state.email ? 'Required' : ''}
      />

      <Input
        addShadow={true}
        secureTextEntry={state.hidePassword}
        label="Password"
        value={state.password}
        onChange={(value) => onChange('password', value)}
      />

      {error ? (
        <Text
          style={{
            textAlign: 'center',
            marginBottom: 10,
            color: 'red',
            fontSize: 18,
          }}>
          {error}
        </Text>
      ) : null}

      <Button onPress={onSubmit} title="Login" loading={loading} />
    </SafeAreaView>
  );
};

const mapStateToProps = ({ auth }) => ({
  localAuth: auth,
});

const mapDispatchToProps = {
  restoreToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
