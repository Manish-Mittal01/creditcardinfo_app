import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { rgbaColor } from 'react-native-reanimated/src/reanimated2/Colors';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserDetails(props) {
    const [userDetails, setUserDetails] = useState({})
    const { item } = props.route.params
    console.log("item", item)

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

    useEffect(() => {
        getUserDetails();
    }, [item])

    return (
        <View>
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
                </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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

