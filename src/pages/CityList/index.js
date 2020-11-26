import React, { Component } from 'react'
import { NavBar ,Icon} from 'antd-mobile';
import './index.scss'
import axios from 'axios'

function formatCityList(list) {
    let cityList = {}
    list.forEach(city => {
        let first = city.short.substr(0,1)
        if(cityList[first]){
            cityList[first].push(city)
        }else{
            cityList[first] = [city]
        }
    })
    
    const cityIndex = Object.keys(cityList).sort()
    return{
        cityList,
        cityIndex
    }
}

export default class CityList extends Component {
    constructor(){
        super()
        this.state = {
            cityList: null,
            cityIndex: []
        }
    }
    componentDidMount(){
        this.fetchCityList()
    }

    // 获取城市信息
    async fetchCityList(){
        const city = await axios.get('http://localhost:8080/area/city?level=1')
        const { cityList,cityIndex } = formatCityList(city.data.body)

        const hotCity = await axios.get('http://localhost:8080/area/hot')
        cityList.hot = hotCity.data.body
        cityIndex.unshift('#')
        this.setState({
            cityList,
            cityIndex
        })
        console.log(cityList,cityIndex);
    }

    

    render() {
        return (
            <div className="citylist-wrapper">
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.go(-1)}
                >城市选择</NavBar>
            </div>
        )
    }
}
