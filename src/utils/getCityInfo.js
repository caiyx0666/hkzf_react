// import axios from 'axios'
import API  from './api';

export default function getCityInfo() {
    // 获取当前城市信息
    return new Promise((resolve, reject) => {
        const curCityStr = localStorage.getItem('cityName')
        let curCity = null
        if (curCityStr) {
            curCity = JSON.parse(curCityStr)
            resolve(curCity)
            return
        } else {
            curCity = {}
        }

        try {
            var myCity = new window.BMap.LocalCity();
            myCity.get(async (result) => {
                var cityName = result.name;
                console.log(cityName);
                const res = await API.get(`http://localhost:8080/area/info?name=${cityName}`)
                localStorage.setItem('cityName',JSON.stringify(res.data.body))
                resolve(res.data.body)
            });
        }
        catch(e) {
            reject(e)
        }
    })
}