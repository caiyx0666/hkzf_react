import React from 'react'
import { Carousel, Grid, Flex } from 'antd-mobile';
import axios from 'axios'
import './index.scss'


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
    componentDidMount() {
        this.getSwipers()
        this.getGroups()
        this.getNews()

        var myCity = new window.BMap.LocalCity();
        myCity.get((result) => {
            var cityName = result.name;
            // console.log(cityName);
            this.getCityInfo(cityName)
        });
    }

    // 获取城市信息
    async getCityInfo(cityName){
        const res = await axios.get(`http://localhost:8080/area/info?name=${cityName}`)
        // console.log(res);
        this.setState({
            cityInfo: res.data.body
        })
    }

    // 导航栏点击跳转事件
    handleJump(item) {
        this.props.history.push(item.path)
    }

    // 获取轮播图信息
    async getSwipers() {
        let res = await axios.get('http://localhost:8080/home/swiper')
        this.setState({
            swipers: res.data.body
        })
    }

    // 获取租房小组信息
    async getGroups() {
        const res = await axios.get('http://localhost:8080/home/groups', {
            params: {
                area: 'AREA%7C88cff55c-aaa4-e2e0'
            }
        })
        this.setState({
            groups: res.data.body
        })
    }

    // 获取最新资讯信息
    async getNews() {
        const res = await axios.get('http://localhost:8080/home/news', {
            params: {
                area: 'AREA%7C88cff55c-aaa4-e2e0'
            }
        })
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
                    src={`http://localhost:8080${item.imgSrc}`}
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
                <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
            </Flex.Item>
        </Flex>)

    // 渲染最新资讯列表 
    renderNews = (item) => (
        <Flex className="news-item">
            <img src={`http://localhost:8080${item.imgSrc}`} alt="" />
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
                    <div className="search-box">
                        <div className="search">
                            <div className="location">
                                {this.state.cityInfo ? this.state.cityInfo.label : '广州'}
                                <i className="iconfont icon-arrow"></i>
                            </div>
                            <div className="form">
                                <i className="iconfont icon-seach"></i>
                                <span>请输入小区或地址</span>
                            </div>
                        </div>
                        <i className="iconfont icon-map"></i>
                    </div>
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