import { Component } from 'react'
import SearchBox from '../../components/SearchBox'
import './index.scss'
import Filter from './components/Filter';
import getCityInfo from '../../utils/getCityInfo'
import API from '../../utils/api'

export default class HouseList extends Component {
    state = {
        cityInfo: {},
        count: 0,
        list: []
    }

    filters = {}

    async componentDidMount() {
        const cityInfo = await getCityInfo();
        this.setState({
            cityInfo
        });
        this.fetchHouseListData();
    }

    async fetchHouseListData(){
        // 获取城市id
        const { label } = await getCityInfo()
        const res = await API.get(`/houses`,{
            params:{
                cityId: label,
                ...this.filters,
                start: 1,
                end: 20
            }
        })

        this.setState({
            count: res.data.body.count,
            list: res.data.body.list
        })

        console.log(res.data.body);
    }

    onFilter = (data) => {
        this.filters = data

        this.fetchHouseListData()
    }

    render() {
        return (
            <div className="houselistWrapper" >
                <div className="header">
                    <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)}></i>
                    <SearchBox />
                </div>
                <div className="houselist">
                    {/* 筛选框 */}
                    <Filter onFilter={this.onFilter} />
                </div>
            </div>
        )
    }
}
