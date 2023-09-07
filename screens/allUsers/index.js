import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { rgbaColor } from 'react-native-reanimated/src/reanimated2/Colors';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const data = [
    {
        name: "Manish Mittal",
        userName: "Manish Mittal",
        email: "test@gmail.com",
        mobile: "12345"
    },
    {
        name: "Manish Mittal",
        userName: "Manish Mittal",
        email: "test@gmail.com",
        mobile: "12345"
    },
    {
        name: "Manish Mittal",
        userName: "Manish Mittal",
        email: "test@gmail.com",
        mobile: "12345"
    },
    {
        name: "Manish Mittal",
        userName: "Manish Mittal",
        email: "test@gmail.com",
        mobile: "12345"
    },
]

export default function AllUsers() {
    const navigation = useNavigation();
    const [allUsers, setAllUsers] = useState([])
    const [pageNumber, setPageNumber] = useState(1)

    const getUsers = async () => {
        try {
            const user = AsyncStorage.getItem("hdfc-bank-token") && JSON.parse(await AsyncStorage.getItem("hdfc-bank-token")) || {}

            const data = {
                "pageNumber": pageNumber || 1,
                "limit": 15
            };

            const response = await axios.post("https://hdfc-bank-9qmz.onrender.com/api/v1/admin/allUsers", data, {
                headers: {
                    adminid: user._id || "64eef26802b813f2cda508ec",
                    token: user.token
                }
            });
            if (response.data?.status) {
                setAllUsers(response.data?.data?.data);
                setPageNumber(pageNumber + 1)
            }
            console.log("get all user api response", response.data)
        }
        catch (error) {
            Alert.alert(error.response?.data?.message)
            console.log("get allusers error", error);
        }
    }

    useEffect(() => {
        getUsers();
    }, [])

    return (
        <View>
            <FlatList
                data={allUsers}
                numColumns={1}
                onEndReached={() => getUsers()}
                renderItem={({ item }) =>
                    <View style={styles.card}>
                        <TouchableOpacity style={styles.touch} onPress={() => { navigation.navigate('UserDetails', { item }) }} >
                            <Text style={styles.title}>User</Text>
                            <View style={styles.description}>

                                <View style={styles.detailRow}>
                                    <Text style={styles.cardKey}>Full Name</Text>
                                    <Text style={styles.cardValue}>{`${item?.firstName}`}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.cardKey}>Email</Text>
                                    <Text style={styles.cardValue}>{item?.email}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Text style={styles.cardKey}>Mobile</Text>
                                    <Text style={styles.cardValue}>{item?.mobile}</Text>
                                </View>
                            </View>

                        </TouchableOpacity>
                    </View>

                }
            />
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
    touch: {
        padding: 10,
    }
})

