import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // 스프링 부트 주소
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;