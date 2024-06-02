import React, { useState, useCallback, useEffect, useContext } from 'react'
import { Alert, Button, Image, Pressable, SafeAreaView, StyleSheet, Switch, Text, TextInput, View, StatusBar } from 'react-native'
import axios from 'axios'
import { config } from '../utils/config';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { ColorContext } from '../utils/ColorContext';


const index = () => {
  const { selectedColor } = useContext(ColorContext);
  const [click, setClick] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [login, setLogin] = useState(true)
  const [register, setRegister] = useState(false)
  const navigation = useNavigation();

  const [styles, setStyles] = useState(createStyles(selectedColor));

  useEffect(() => {
    setStyles(createStyles(selectedColor));
  }, [selectedColor]);
  //login function using axios
  const handleLogin = async () => {
    const data = {
      email: email,
      password: password,
    };
    try {
      const res = await axios.post(`${config.baseurl}/login`, data);
      // save token to async storgae
      await AsyncStorage.setItem('token', res.data.token);
      // // redirect to notes
      router.replace('/home');
    } catch (err) {
      console.log(err);

    }
  };

  //register function using axios
  const HandleRegister = async () => {
    const data = {
      email, password, username
    };
    try {
      const res = await axios.post(`${config.baseurl}/register`, data);
      setRegister(true)
      setTimeout(() => {
        setRegister(false)
      }, 3000);
      setLogin(true)
    } catch (err) {
      console.log(err);

    }
  };

  // change to login and register
  function ChangeForm() {
    setEmail('')
    setUsername('')
    setPassword('')
    setLogin(!login)
  }

  return (
    <SafeAreaView style={styles.container}>
      {login ?
        <>
          <Text style={styles.title}>Login</Text>
          <View style={styles.inputView}>
            <TextInput style={styles.input} placeholder='EMAIL' value={email} onChangeText={text => setEmail(text)} autoCorrect={false}
              autoCapitalize='none' />
            <TextInput style={styles.input} placeholder='PASSWORD' secureTextEntry value={password} onChangeText={text => setPassword(text)} autoCorrect={false}
              autoCapitalize='none' />
          </View>

          <View style={styles.buttonView} >
            <Pressable style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText} >LOGIN</Text>
            </Pressable>
          </View>

          <Text style={styles.buttonView1}>Do not have an Account? <Text style={styles.register} onPress={ChangeForm}>CLICK HERE</Text></Text>
        </>
        :
        <>
          <Text style={styles.title}>Sign UP</Text>
          <View style={styles.inputView}>
            <TextInput style={styles.input} placeholder='EMAIL' value={email} onChangeText={text => setEmail(text)} autoCorrect={false}
              autoCapitalize='none' />
            <TextInput style={styles.input} placeholder='USERNAME' value={username} onChangeText={text => setUsername(text)} autoCorrect={false}
              autoCapitalize='none' />
            <TextInput style={styles.input} placeholder='PASSWORD' secureTextEntry value={password} onChangeText={text => setPassword(text)} autoCorrect={false}
              autoCapitalize='none' />
          </View>

          <View style={styles.buttonView} >
            <Pressable style={styles.button} onPress={HandleRegister}>
              <Text style={styles.buttonText} >REGISTER</Text>
            </Pressable>
          </View>
          <Text style={styles.buttonView1}>Already a User ? <Text style={styles.register} onPress={ChangeForm}>CLICK HERE</Text></Text>
        </>
      }
      {register &&
        <>
          <View style={styles.modalout}>
            <View style={styles.modalbox}>
              <Text>
                USER register Successfully
              </Text>
            </View>
          </View>
        </>

      }
    </SafeAreaView>
  )
}
const createStyles = (selectedColor) => StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: "center",
    paddingTop: 100,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    paddingVertical: 40,
    color: selectedColor
  },
  inputView: {
    gap: 15,
    width: "100%",
    paddingHorizontal: 40,
    marginBottom: 5
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: selectedColor,
    borderWidth: 1,
    borderRadius: 7
  },
  rememberView: {
    width: "100%",
    paddingHorizontal: 50,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 8
  },
  switch: {
    flexDirection: "row",
    gap: 1,
    justifyContent: "center",
    alignItems: "center"

  },
  rememberText: {
    fontSize: 13
  },
  forgetText: {
    fontSize: 11,
    color: selectedColor
  },
  button: {
    backgroundColor: selectedColor,
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },
  register: {
    color: selectedColor,
    fontSize: 15,
    fontWeight: "semi-bold"
  },
  buttonView: {
    width: "100%",
    paddingHorizontal: 50,
    marginTop: 20
  },

  buttonView1: {
    width: "100%",
    marginTop: 20,
    textAlign: "center",
  },
  modalout: {

    width: "100vw",
    height: "100vh",
    position: 'fixed',
    backgroundColor: selectedColor,
    top: '0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalbox: {
    width: '50%',
    paddingVertical: 30,
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 30,
    fontSize: 20,
    textAlign: 'center'
  }




})


export default index