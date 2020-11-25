import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import Index from '../Index'
import HouseList from '../HouseList'
import News from '../News'
import Profile from '../Profile'

export default class Home extends Component {
    render() {
        return (
            <div>
                <Route exact path="/home" component={Index} />
                <Route path="/home/houselist" component={HouseList} />
                <Route path="/home/news" component={News} />
                <Route path="/home/profile" component={Profile} />
                <div>首页TabBa</div>
            </div>
        )
    }
}