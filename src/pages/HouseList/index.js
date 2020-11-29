import { Component } from 'react'
import SearchBox from '../../components/SearchBox'
import './index.scss'
import Filter from './components/Filter';
export default class HouseList extends Component {
    render() {
        return (
            <div className="houselistWrapper" >
                <div className="header">
                    <i className="iconfont icon-back" onClick={()=> this.props.history.go(-1)}></i>
                    <SearchBox />
                </div>
                <div className="houselist">
                    {/* 筛选框 */}
                    <Filter  />
                </div>
            </div>
        )
    }
}
