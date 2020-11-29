import './index.scss'
import { withRouter } from 'react-router-dom'
import getCityInfo from '../../utils/getCityInfo'
import React from 'react'

class SearchBox extends React.Component{
    state = {
        CityName: ''
    }
    async componentDidMount(){
        let {label} = await getCityInfo()
        this.setState({
            CityName: label
        })
    }
    render(){
        return (
            <div className="search-box">
                <div className="search">
                    <div className="location" onClick={() => this.props.history.push('/citylist')}>
                        {this.state.CityName ? this.state.CityName : '广州'}
                        <i className="iconfont icon-arrow"></i>
                    </div>
                    <div className="form">
                        <i className="iconfont icon-seach"></i>
                        <span>请输入小区或地址</span>
                    </div>
                </div>
                <i className="iconfont icon-map" onClick={() => this.props.history.push('/map')}></i>
            </div>
        )
    }
}

export default withRouter(SearchBox)