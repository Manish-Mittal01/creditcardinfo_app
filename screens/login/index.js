import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Alert } from 'react-native'
import React, { useState } from 'react'
import { rgbaColor } from 'react-native-reanimated/src/reanimated2/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../axios'
import { CommonActions } from '@react-navigation/native';

import { Formik } from 'formik';
import * as yup from 'yup'

const schema = yup.object().shape({
    mobile: yup.string().required('Please enter Mobile Number'),
    password: yup.string().required('Please enter Password First').min(6, 'password must be atleast character 6 long'),
    // .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, 'Must have an Upercase, smallcase, digit and a special chacter')
})

export default function LoginScreen({ navigation }) {
    const [login, setLogin] = useState(false)

    const loginSubmit = async (value) => {
        console.log("login values", value)
        setLogin(true)

        try {
            const response = await axios.post("user/login", value)
            console.log("login response", response.data)
            if (response.data?.status) {

                setLogin(false)
                AsyncStorage.setItem("hdfc-bank-token", JSON.stringify(response.data?.data))
                if (response.data?.data?.role === "admin") {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'AllUsers' }, { name: 'CardDetails' },]
                    })
                } else if (response.data?.data?.role === "user") {
                    navigation.navigate("Splash")
                    // navigation.reset({
                    //     index: 0,
                    //     routes: [{ name: 'Splash' },x { name: 'CardDetails' },]
                    // })
                    // navigation.dispatch(
                    //     CommonActions.reset({
                    //         index: 0,
                    //         routes: [
                    //             { name: 'Splash' }, { name: 'CardDetails' }
                    //         ],
                    //     })
                    // );

                }
            }

        }
        catch (err) {
            setLogin(false)
            Alert.alert(err.response?.data.message || "something wrong happend")
            console.log("login err", err)
            console.log("login error", err.response?.data.message)
        }
    }



    return (
        <Formik
            initialValues={{ mobile: "", password: "" }}
            validationSchema={schema}
            onSubmit={(values) => {
                loginSubmit(values)
            }}
        >
            {
                ({ handleChange, handleSubmit, values, touched, errors }) => (
                    // <ImageBackground source={{uri:}} resizeMode="cover" style={styles.image}>
                    <ScrollView>
                        <View style={styles.container}>

                            <View style={styles.MainView}>
                                <Text style={styles.Title}>Login</Text>
                                <TextInput style={styles.Input} keyboardType={'phone-pad'}
                                    theme={{ colors: { text: rgbaColor(20, 247, 12) } }}
                                    name='mobile' placeholder="Mobile" placeholderTextColor={'whitesmoke'}
                                    value={values.mobile}
                                    onChangeText={handleChange("mobile")}
                                />
                                {(errors.mobile && touched.mobile) ?
                                    <Text style={styles.error} >{errors.mobile}</Text> : null
                                }
                                <TextInput style={styles.Input} secureTextEntry={true}
                                    theme={{ colors: { text: rgbaColor(20, 247, 12) } }}
                                    name="password" value={values.password}
                                    placeholder="Password" placeholderTextColor={'whitesmoke'}
                                    onChangeText={handleChange("password")} />
                                {(errors.password && touched.password) ?
                                    <Text style={styles.error} >{errors.password}</Text> : null
                                }
                                <TouchableOpacity disabled={login} style={styles.Login} type="submit" onPress={handleSubmit} >
                                    <Text style={styles.LoginText}>Log In</Text>
                                </TouchableOpacity>


                                <Text style={styles.NoAccount}> Don't have an account?</Text>
                                <TouchableOpacity style={styles.SignIn} onPress={() => navigation.navigate('Signup')}>
                                    <Text style={styles.SignInText}>Sign up</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                    // </ImageBackground>
                )}
        </Formik>
    )
}


const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height, flexDirection: 'column', justifyContent: 'center',

    },
    MainView: {
        backgroundColor: rgbaColor(0, 0, 0, 0.70),
        borderRadius: 20,
        marginHorizontal: 40,
        paddingTop: 50,
        paddingBottom: 30,
        paddingHorizontal: 20
    },
    Title: {
        color: "white",
        fontSize: 25,
        textAlign: 'center',
        fontWeight: '600',
        lineHeight: 40
    },
    Input: {
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        color: rgbaColor(20, 247, 12),
        fontWeight: '500',
        fontFamily: 'monospace'
    },
    Login: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 7,
        marginTop: 25,
    },
    LoginText: {
        textAlign: "center",
        fontWeight: "500",
        fontSize: 17,
        color: "#000"
    },
    ForPass: {
        marginTop: 10,
    },
    ForPassText: {
        fontFamily: 'sans-serif',
        color: 'royalblue',
        textAlign: 'center'
    },
    NoAccount: {
        fontFamily: "sans-serif",
        marginTop: 30,
        color: 'white',
        textAlign: 'center'
    },
    SignInText: {
        color: rgbaColor(50, 140, 240),
        fontSize: 22,
        textAlign: 'center'
    },
    error: {
        fontSize: 14,
        color: 'red',
        marginTop: 3,
    }
})