import axios from 'axios'

const instance = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000, // 表示请求的毫秒数，超过该时间，将停止发送请求
})

export default instance