import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Alert, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import { rgbaColor } from 'react-native-reanimated/src/reanimated2/Colors';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as yup from 'yup'
import axios from '../../axios';
// import axios from 'axios';


const schema = yup.object().shape({
    firstName: yup.string().trim().required('This Field is Required').min(4, 'Must be 4 atleast Character long'),
    password: yup.string().trim().required('This Field is Required').min(6, 'password must be atleast character 6 long'),
    // .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, 'Must have an Upercase, smallcase, digit and a special chacter'),
    confirmPassword: yup.string().trim().required('This Field is Required').oneOf([yup.ref('password')], 'Password and Confirm Password does not Matches'),
    email: yup.string().trim().required('This Field is Required').email('Invalid Email'),
    mobile: yup.string().required('This Field is Required').min(10, 'Mobile Number must be atleast 10 disits long').max(10, 'Mobile Number can be maximum 10 digit long').test(
        "test-ctype",
        "Invalid Mobile Number",
        (value) => ["6", "7", "8", "9"].includes(value[0])
    ),
    otp: yup.string().required("This Field is Required")

})

export default function SignupScreen() {
    const [otpSent, setOtpSent] = useState(false)
    const Navigation = useNavigation();

    async function registerUser(value, resetForm) {
        console.log("values", value)
        try {
            delete value.confirmPassword
            const response = await axios.post("user/register", value);
            console.log("register response ", response.data)
            if (response.data?.status) {
                Alert.alert("user registered successfully")
                Navigation.navigate("Login")
                setOtpSent(false)
            }
        }
        catch (error) {
            Alert.alert(error.response?.data.message || "something wrong happend")
            console.log("register error", error.response.data)
            setOtpSent(false)
        }
    }

    const sendOtp = async (mobile) => {
        console.log({ mobile });
        setOtpSent(true)
        const data = {
            mobile: mobile
        }

        try {
            const response = await axios.post("user/sendOtp", data)
            if (response.data?.status === true) {
                console.log("otp response", response.data)
                Alert.alert("otp sent successfully")
            }
        }
        catch (error) {
            Alert.alert(error.response?.data.message || "Unable to send otp please try again")
            setOtpSent(false)
        }
    }

    return (
        <Formik
            initialValues={{ firstName: "", password: "", confirmPassword: "", email: "", mobile: "", otp: "" }}
            validationSchema={schema}
            onSubmit={(values, { resetForm }) => registerUser(values, resetForm)}
        >
            {
                ({ handleChange, handleSubmit, values, touched, errors }) => {
                    console.log("errors", errors)
                    return (
                        <ImageBackground source={require("../../assets/background.jpeg")} resizeMode="cover" style={styles.image}>
                            <ScrollView>
                                <View style={styles.container}>
                                    <View style={styles.MainView}>
                                        <Text style={styles.Title}>Sign In</Text>
                                        <TextInput style={styles.Input}
                                            onChangeText={handleChange("firstName")}
                                            value={values.firstName}
                                            placeholder="First Name" placeholderTextColor={"whitesmoke"} />
                                        {(errors.firstName && touched.firstName) ?
                                            <Text style={styles.error} >{errors.firstName}</Text> : null
                                        }

                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <View style={{ flex: 4 }}>
                                                <TextInput style={styles.Input} keyboardType={'phone-pad'}
                                                    value={values.mobile}
                                                    onChangeText={handleChange("mobile")}
                                                    placeholder="Enter your Mobile Number" placeholderTextColor={'whitesmoke'} />
                                                {(errors.mobile && touched.mobile) ?
                                                    <Text style={styles.error} >{errors.mobile}</Text> : null
                                                }
                                            </View>
                                            <TouchableOpacity disabled={!!errors.mobile || otpSent} style={{ ...styles.SignIn, ...styles.sendOtpText }} onPress={() => sendOtp(values.mobile)} underlayColor='transparent'>
                                                <Text style={{ ...styles.SignInText, paddingHorizontal: 6, fontSize: 12 }}>
                                                    Send OTP
                                                </Text>
                                            </TouchableOpacity>
                                        </View>

                                        <TextInput style={styles.Input} keyboardType={'phone-pad'}
                                            value={values.otp}
                                            onChangeText={handleChange("otp")}
                                            placeholder="Enter OTP" placeholderTextColor={'whitesmoke'} />
                                        {(errors.otp && touched.otp) ?
                                            <Text style={styles.error} >{errors.otp}</Text> : null
                                        }
                                        <TextInput style={styles.Input} secureTextEntry={true}
                                            value={values.password}

                                            onChangeText={handleChange("password")}
                                            placeholder="Password" placeholderTextColor={'whitesmoke'} />
                                        {(errors.password && touched.password) ?
                                            <Text style={styles.error} >{errors.password}</Text> : null
                                        }
                                        <TextInput style={styles.Input} secureTextEntry={true}
                                            value={values.confirmPassword}
                                            onChangeText={handleChange("confirmPassword")}
                                            placeholder="Confirm Password" placeholderTextColor={'whitesmoke'} />
                                        {(errors.confirmPassword && touched.confirmPassword) ?
                                            <Text style={styles.error} >{errors.confirmPassword}</Text> : null
                                        }
                                        <TextInput style={styles.Input} keyboardType={'email-address'}
                                            value={values.email}
                                            onChangeText={handleChange("email")}
                                            placeholder="Enter your Email" placeholderTextColor={'whitesmoke'} />
                                        {(errors.email && touched.email) ?
                                            <Text style={styles.error} >{errors.email}</Text> : null
                                        }

                                        <TouchableOpacity style={styles.SignIn} onPress={handleSubmit} >
                                            <Text style={styles.SignInText}>Sign In</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.HaveAccount}> Already have an account?</Text>
                                        <TouchableOpacity style={styles.LogIn} onPress={() => Navigation.navigate('Login')} >
                                            <Text style={styles.LogInText}>Log In</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </ImageBackground>
                    )
                }}
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
        marginVertical: 30,
        marginHorizontal: 15,
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
        color: "#fff",
    },

    SignIn: {
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 7,
        marginTop: 25,
    },
    SignInText: {
        textAlign: "center",
        fontWeight: "500",
        fontSize: 17,
        color: "#000"
    },
    sendOtpText: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0,
    },
    HaveAccount: {
        fontFamily: "sans-serif",
        marginTop: 30,
        color: 'white',
        textAlign: 'center'
    },
    LogInText: {
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