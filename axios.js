import axios from 'axios';


axios.defaults.baseURL = "https://hdfc-bank-9qmz.onrender.com/api/v1/"
axios.defaults.headers = {
    'Content-Type': 'application/json',
}

export default axios;

