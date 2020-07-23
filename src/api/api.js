import axios from 'axios';

export default function fetchUrl() {
    const defaultOptions = {
        baseURL: 'https://api.nomics.com/v1',
        // headers: {
        //     'Content-Type': 'application/json',
        //     'Access-Control-Allow-Origin': 'http://localhost:8080',
        //     'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        //     'Access-Control-Allow-Credentials': true,
        //     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS'
        // },
    };

    // Create instance
    let instance = axios.create(defaultOptions);


    return instance;
};

