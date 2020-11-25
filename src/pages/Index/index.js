import React, { Component } from 'react'
import { Carousel,Grid,Flex } from 'antd-mobile';
import axios from 'axios'
import './index.scss'


import Nav1 from '../../assets/images/nav-1.png'
import Nav2 from '../../assets/images/nav-2.png'
import Nav3 from '../../assets/images/nav-3.png'
import Nav4 from '../../assets/images/nav-4.png'

const navs = [
    { img: Nav1, title: '整租' },
    { img: Nav2, title: '合租' },
    { img: Nav3, title: '地图找房' },
    { img: Nav4, title: '去出租' }
]
  
  const data1 = Array.from(new Array(4)).map(() => ({
    icon: 'https://gw.alipayobjects.com/zos/rmsportal/WXoqXTHrSnRcUwEaQgXJ.png',
  }));

export default class Index extends Component {
    render() {
        return (
            <div>
                <App />
            </div>
        )
    }
}

class App extends React.Component {
    state = {
        swipers: [],
        imgHeight: 212,
    }
    componentDidMount() {
        this.getSwipers()
    }

    async getSwipers() {
        const res = await axios.get('http://localhost:8080/home/swiper')
        console.log(res.data.body)
        this.setState({
            swipers: res.data.body
        })
    }

    render() {
        return (
            <div className='index'>

                <div className='swipers'>
                    {this.state.swipers.length ? <Carousel
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
                    </Carousel> : null}
                </div>

                <Flex justify='around' className='nav'>
                    {navs.map((item, index) => <Flex.Item key={index}><img src={item.img} alt="" /> <h2>{item.title}</h2></Flex.Item>)}
                </Flex>

                {/* 租房小组 */}
                <div className="groups">
                    <div className="title">
                        <span className="zufan">租房小组</span>
                        <span className="more">更多</span>
                    </div>

                    <Grid data={data1}
                        columnNum={2}
                        square={false}
                        hasLine={false}
                        renderItem={dataItem => (
                            <Flex className="group-item">
                                <Flex.Item className="item">
                                    <h3>家住回龙观</h3>
                                    <p>归属的感觉</p>
                                </Flex.Item>
                                <Flex.Item className="item">
                                    <img src="http://localhost:8080/img/groups/1.png" />
                                </Flex.Item>
                            </Flex>
                        )}
                    />
                </div>
            </div>

        );
    }
}