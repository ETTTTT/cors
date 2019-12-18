import axios from 'axios';

axios.get('/webpack').then(res => {
    console.log(res);
});