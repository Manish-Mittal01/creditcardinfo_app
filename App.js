import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/login';
import SignupScreen from './screens/register';
import CardDetails from './screens/cardDetails';
import AllUsers from './screens/allUsers';
import UserDetails from './screens/userDetails';
import AsyncStorage from '@react-native-async-storage/async-storage';



const Stack = createStackNavigator()


const App = () => {
  const [user, setUser] = useState({})
  useEffect(() => {
    const getUser = async () => {
      const myUser = AsyncStorage.getItem("hdfc-bank-token") && JSON.parse(await AsyncStorage.getItem("hdfc-bank-token")) || {}
      setUser(myUser)
    }
    getUser()
  }, [])


  console.log("user", user)

  return (
    <NavigationContainer>
      <Stack.Navigator >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="UserDetails" component={UserDetails} />
        <Stack.Screen name="AllUsers" component={AllUsers} />
        <Stack.Screen name="CardDetails" component={CardDetails} />
        {/* {
          !(user.token) ?
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Signup" component={SignupScreen} />
            </>
            : user.role === "user" ?
              <Stack.Screen name="UserDetails" component={UserDetails} />
              : user.role === "admin" &&
              <>

                <Stack.Screen name="AllUsers" component={AllUsers} />
                <Stack.Screen name="CardDetails" component={CardDetails} />
              </>
        } */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}


export default App;
