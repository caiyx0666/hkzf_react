import axios from 'axios'
import BASE_URL from './url'

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 5000, // 表示请求的毫秒数，超过该时间，将停止发送请求
})

export default instance