import React, { useEffect, useState } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/login';
import SignupScreen from './screens/register';
import CardDetails from './screens/cardDetails';
import AllUsers from './screens/allUsers';
import UserDetails from './screens/userDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './screens/splash/splash';

const Stack = createStackNavigator()

const App = () => {
  // const navigation = useNavigation()
  // useEffect(() => {
  //   if (AsyncStorage.getItem("hdfc-bank-token")) {
  //     AsyncStorage.getItem("hdfc-bank-token")
  //       .then(resp => {
  //         console.log("resp", JSON.parse(resp).role)
  //         if (JSON.parse(resp).role === "admin") {
  //           navigation.reset({
  //             index: 0,
  //             routes: [{ name: 'AllUsers' }]
  //           })
  //         } else if (JSON.parse(resp).role === "user") {
  //           navigation.reset({
  //             index: 0,
  //             routes: [{ name: 'Splash' }]
  //           })
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error)
  //       })
  //   }
  // }, [])

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        headerShown: false
      }} >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="UserDetails" component={UserDetails} />
        <Stack.Screen name="AllUsers" component={AllUsers} />
        <Stack.Screen name="CardDetails" component={CardDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;
