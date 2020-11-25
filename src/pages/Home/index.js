import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Index from '../Index'
import HouseList from '../HouseList'
import News from '../News'
import Profile from '../Profile'
import './index.css'

// 引入TabBar组件
import { TabBar } from 'antd-mobile';

const TabBars = [
    {title:'首页',icon:'icon-ind',path:'/home'},
    {title:'找房',icon:'icon-findHouse',path:'/home/houselist'},
    {title:'资讯',icon:'icon-infom',path:'/home/news'},
    {title:'我的',icon:'icon-myinfo',path:'/home/my'},
]

export default class Home extends Component {
    render() {
        return (
            <div className="home">
                <Route exact path="/home" component={Index} />
                <Route path="/home/houselist" component={HouseList} />
                <Route path="/home/news" component={News} />
                <Route path="/home/my" component={Profile} />
                
                    <TabBar
                        unselectedTintColor="#949494"
                        tintColor="#21b97a"
                        barTintColor="white"
                    >
                        {TabBars.map((item) => (
                            <TabBar.Item
                            title={item.title}
                            key={item.path}
                            icon={<i className={`iconfont ${item.icon}`}></i>}
                            selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
                            selected={this.props.location.pathname === item.path}
                            onPress={() => { this.props.history.push(item.path) }}
                            />
                        ))}
                    </TabBar>
            </div>
        )
    }
}