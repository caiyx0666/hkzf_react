import React, { Component } from 'react'
import { Toast } from 'antd-mobile';
import './index.scss'
// import axios from 'axios'

import API  from '../../utils/api';
import getCityInfo from '../../utils/getCityInfo'
import NavHeader from '../../components/NavHeader'

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
        // 创建Ref引用
        this.listRef = React.createRef()
    }

    // 点击城市进行切换
    changeCity(item){
        if(['北京','上海','广州','深圳'].indexOf(item.label) > -1){
            // 正常切换
            localStorage.setItem('cityName',JSON.stringify(item))

            this.props.history.go(-1)
        }else{
            // 没有房源
            // 第一个参数  提示的内容
            // 第二个参数  提示的持续时间
            // 第三个  提示框的关闭回调
            // 第四个参数  是否需要防止点击穿透的遮罩
            Toast.info('该城市暂无房源数据!',2,null,false)
        }
    }

    // 右侧索引点击滚动
    scrollTo(index) {
        // 通过非受控拿到List组件的实例
        this.listRef.current.scrollToRow(index)
    }

    // 动态切换显示高亮
    onRowsRendered = ({ startIndex }) => {
        let { curIndex } = this.state;
        if (curIndex !== startIndex) {
            this.setState({
                curIndex: startIndex
            },()=>{
                // 解决List组件js驱动滚动误差问题
                this.listRef.current.measureAllRows();
            })
        }
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
        switch (letter) {
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
                {list.map((item, index) => (<div key={index} className="name" onClick={this.changeCity.bind(this,item)}>{item.label}</div>))}
            </div>
        );
    }

    // 获取列表每一行高度
    getRowHeight = ({ index }) => {
        const letter = this.state.cityIndex[index]
        const list = this.state.cityList[letter]

        return titleHeight + nameHeight * list.length
    }

    componentDidMount() {
        this.fetchCityList()
    }

    // 获取城市信息
    async fetchCityList() {
        const city = await API.get('/area/city?level=1')
        const { cityList, cityIndex } = formatCityList(city.data.body)

        const hotCity = await API.get('/area/hot')
        cityList.hot = hotCity.data.body
        cityIndex.unshift('hot')

        const myCityInfo = await getCityInfo()
        cityList['#'] = [myCityInfo]
        cityIndex.unshift('#')

        this.setState({
            cityList,
            cityIndex
        }, () => {
            // 解决List组件js驱动滚动误差问题
            this.listRef.current.measureAllRows();
        })
    }

    render() {
        return (
            <div className="citylist-wrapper">
                <NavHeader>城市选择</NavHeader>
                <AutoSizer>
                    {({ height, width }) => (
                        <List
                            width={width}
                            height={height}
                            rowCount={this.state.cityIndex.length}
                            rowHeight={this.getRowHeight}
                            rowRenderer={this.rowRenderer}
                            onRowsRendered={this.onRowsRendered}
                            scrollToAlignment={'start'}
                            ref={this.listRef}
                        />
                    )}
                </AutoSizer>

                <ul className="city-index">
                    {this.state.cityIndex.map((item, index) => (
                        <li key={index} className="city-index-item" onClick={() => this.scrollTo(index)}>
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
