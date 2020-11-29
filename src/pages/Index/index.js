import React from 'react'
import { Carousel, Grid, Flex } from 'antd-mobile';
// import axios from 'axios'
import SearchBox from '../../components/SearchBox'

import API  from '../../utils/api';
import  BASE_URL from '../../utils/url';
import './index.scss'
import getCityInfo from '../../utils/getCityInfo'


import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

let navs = [
    { img: Nav1, title: '整租', path: '/home/houselist' },
    { img: Nav2, title: '合租', path: '/home/houselist' },
    { img: Nav3, title: '地图找房', path: '/map' },
    { img: Nav4, title: '去出租', path: '/login' }
]

export default class Index extends React.Component {
    state = {
        swipers: [],
        imgHeight: 212,
        news: [],
        groups: [],
        cityInfo: null
    }
    async componentDidMount() {
        const cityName = await getCityInfo()
        this.setState({
            cityInfo: cityName
        })

        this.getSwipers()
        this.getGroups()
        this.getNews()
    }

    // 导航栏点击跳转事件
    handleJump(item) {
        this.props.history.push(item.path)
    }

    // 获取轮播图信息
    async getSwipers() {
        let res = await API.get('/home/swiper')
        this.setState({
            swipers: res.data.body
        })
    }

    // 获取租房小组信息
    async getGroups() {
        const res = await API.get('/home/groups', {
            params: {
                area: this.state.cityInfo.value
            }
        })
        console.log('租房小组',res.data.body);
        this.setState({
            groups: res.data.body
        })
    }

    // 获取最新资讯信息
    async getNews() {
        const res = await API.get('/home/news', {
            params: {
                area: this.state.cityInfo.value
            }
        })
        console.log('news',res.data.body);
        this.setState({
            news: res.data.body
        })
    }

    // 渲染轮播图列表
    renderSwipers = () => (this.state.swipers.length ? <Carousel
        autoplay={true}
        infinite
    >
        {this.state.swipers.map(item => (
            <a
                key={item.id}
                href="http://www.alipay.com"
                style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
            >
                <img
                    src={`${BASE_URL}${item.imgSrc}`}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top' }}
                />
            </a>
        ))}
    </Carousel> : null)

    // 渲染租房小组信息
    renderItem = (item) =>
        (<Flex key={item.id} className="group-item">
            <Flex.Item className="item">
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
            </Flex.Item>
            <Flex.Item className="item">
                <img src={`${BASE_URL}${item.imgSrc}`} alt="" />
            </Flex.Item>
        </Flex>)

    // 渲染最新资讯列表 
    renderNews = (item) => (
        <Flex className="news-item">
            <img src={`${BASE_URL}${item.imgSrc}`} alt="" />
            <Flex justify="center" className="desc" direction="column" align="start">
                <h3>{item.title}</h3>
                <Flex justify="between" className="info">
                    <span>{item.from}</span>
                    <span>{item.date}</span>
                </Flex>
            </Flex>
        </Flex>
    )

    render() {
        return (
            <div className='index'>

                {/* 轮播图区域 */}
                <div className='swipers'>
                    <SearchBox />
                    {this.renderSwipers()}
                </div>

                {/* 导航栏 */}
                <Flex justify='around' className='nav'>
                    {navs.map((item, index) => (
                        <Flex.Item key={index} onClick={this.handleJump.bind(this, item)} ><img src={item.img} alt="" /> <h2>{item.title}</h2></Flex.Item>
                    ))}
                </Flex>

                {/* 租房小组 */}
                <div className="groups">
                    <div className="title">
                        <span className="zufan">租房小组</span>
                        <span className="more">更多</span>
                    </div>

                    <Grid data={this.state.groups}
                        columnNum={2}
                        square={false}
                        hasLine={false}
                        renderItem={this.renderItem}
                    />
                </div>

                {/* 最新资讯 */}
                <div className="news">
                    <h3>最新资讯</h3>
                    <Grid data={this.state.news}
                        columnNum={1}
                        square={false}
                        hasLine={false}
                        renderItem={this.renderNews}
                    />
                </div>
            </div>
        );
    }
}