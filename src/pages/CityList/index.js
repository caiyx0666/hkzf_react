import React, { Component } from 'react'
import { NavBar, Icon } from 'antd-mobile';
import './index.scss'
import axios from 'axios'
import getCityInfo from '../../utils/getCityInfo'

// 导入List组件
import { List, AutoSizer } from 'react-virtualized';

function formatCityList(list) {
    let cityList = {}
    list.forEach(city => {
        let first = city.short.substr(0, 1)
        if (cityList[first]) {
            cityList[first].push(city)
        } else {
            cityList[first] = [city]
        }
    })

    const cityIndex = Object.keys(cityList).sort()
    return {
        cityList,
        cityIndex
    }
}

const titleHeight = 36
const nameHeight = 50

export default class CityList extends Component {
    constructor() {
        super()
        this.state = {
            cityList: null,
            cityIndex: [],
            curIndex: 0
        }
    }

    // 动态切换显示高亮
    onRowsRendered = ({startIndex})=>{
        if(startIndex === this.state.curIndex){
            return
        }
        this.setState({
            curIndex: startIndex
        })
    }

    // 渲染每一行的信息
    rowRenderer = ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }) => {
        const letter = this.state.cityIndex[index]
        const list = this.state.cityList[letter]
        let title = ''
        switch(letter){
            case '#':
                title = '当前城市'
                break
            case 'hot':
                title = '热门城市'
                break
            default:
                title = letter.toUpperCase()
                break
        }

        return (
            <div key={key} style={style} className="city">
                <div className="title">{title}</div>
                {list.map((item,index)=> (<div key={index} className="name">{item.label}</div>))}
            </div>
        );
    }

    // 获取列表每一行高度
    getRowHeight = ({ index })=>{
        const letter = this.state.cityIndex[index]
        const list = this.state.cityList[letter]

        return titleHeight + nameHeight * list.length
    }

    componentDidMount() {
        this.fetchCityList()
    }

    // 获取城市信息
    async fetchCityList() {
        const city = await axios.get('http://localhost:8080/area/city?level=1')
        const { cityList, cityIndex } = formatCityList(city.data.body)

        const hotCity = await axios.get('http://localhost:8080/area/hot')
        cityList.hot = hotCity.data.body
        cityIndex.unshift('hot')
        const myCityInfo = await getCityInfo()
        cityList['#'] = [myCityInfo]
        cityIndex.unshift('#')
        this.setState({
            cityList,
            cityIndex
        })
    }

    render() {
        return (
            <div className="citylist-wrapper">
                <NavBar
                    mode="light"
                    icon={<Icon type="left" />}
                    onLeftClick={() => this.props.history.go(-1)}
                >城市选择</NavBar>

                <AutoSizer>
                    {({ height,width }) => (
                        <List
                            width={width}
                            height={height}
                            rowCount={this.state.cityIndex.length}
                            rowHeight={this.getRowHeight}
                            rowRenderer={this.rowRenderer}
                            onRowsRendered={this.onRowsRendered}
                        />
                    )}
                </AutoSizer>

                <ul className="city-index">
                        {this.state.cityIndex.map((item,index) => (
                            <li key={index} className="city-index-item">
                                <span className={index === this.state.curIndex ? 'index-active' : ''}>
                                    {item === 'hot' ? '热' : item.toUpperCase()}
                                </span>
                            </li>
                        ))}
                </ul>
            </div>
        )
    }
}
