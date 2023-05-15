

import axios from 'axios';


const dmgApi = axios.create({
    baseURL: '/api'
});


export default dmgApi;