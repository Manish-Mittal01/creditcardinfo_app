import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, PermissionsAndroid, Alert, Linking } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/login';
import SignupScreen from './screens/register';
import CardDetails from './screens/cardDetails';
import AllUsers from './screens/allUsers';
import UserDetails from './screens/userDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SplashScreen from './screens/splash/splash';
import Profile from './screens/Profile';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const App = () => {
  const navigation = useNavigation()
  if (AsyncStorage.getItem("hdfc-bank-token")) {
    AsyncStorage.getItem("hdfc-bank-token")
      .then(resp => {
        console.log("first")
        if (!resp) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }]
          })
        }
        if (JSON.parse(resp).role === "admin") {
          navigation.reset({
            index: 0,
            routes: [{ name: 'AllUsers' }]
          })
        } else if (JSON.parse(resp).role === "user") {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Splash' }]
          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }


  return (
    // <NavigationContainer>
    <Stack.Navigator screenOptions={{
      headerShown: false
    }} >

      <Stack.Screen name="Loading" component={Loader} />

      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="CardDetails" component={Home} />
      <Stack.Screen name="AllUsers" component={AllUsers} />
      <Stack.Screen name="UserDetails" component={UserDetails} />
    </Stack.Navigator>
    // </NavigationContainer>
  );
}

const Loader = () => {
  return (
    <ActivityIndicator style={{ display: "flex", height: "100%", alignItems: 'center' }} />
  )
}

export default App;

const Home = () => {
  return (
    <Tab.Navigator screenOptions={{ labeled: false }} >
      <Tab.Screen name='Card' component={CardDetails} options={{
        headerShown: false,
        tabBarLabel: "Card",
        tabBarLabelStyle: { fontSize: 18 },
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name='card-account-details-outline' color={color} size={25} />
        )
      }} />
      <Tab.Screen name='Profile' component={Profile} options={{
        headerShown: false,
        tabBarLabel: "Profile",
        tabBarLabelStyle: { fontSize: 18 },

        tabBarIcon: ({ focused, color }) => (
          <MaterialCommunityIcons name='account' color={color} size={25} />
        )
      }} />

    </Tab.Navigator>
  )
}