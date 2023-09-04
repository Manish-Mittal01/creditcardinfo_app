import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

axios.defaults.baseURL = "https://hdfc-bank-9qmz.onrender.com/api/v1/"
const user = AsyncStorage.getItem("hdfc-bank-token") && JSON.parse(await AsyncStorage.getItem("hdfc-bank-token")) || {}


axios.defaults.headers = {
    'Content-Type': 'application/json',
    userid: user._id,
    token: user.token
}

export default axios