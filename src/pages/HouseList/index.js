import { Component } from 'react'
import SearchBox from '../../components/SearchBox'
import './index.scss'
export default class HouseList extends Component {
    render() {
        return (
            <div className="houselist" >
                <div className="header">
                    <i className="iconfont icon-back"></i>
                    <SearchBox />
                </div>
            </div>
        )
    }
}
