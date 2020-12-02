import { Component } from 'react'
import SearchBox from '../../components/SearchBox'
import styles from  './index.module.scss'
import Filter from './components/Filter';
import getCityInfo from '../../utils/getCityInfo'
import API from '../../utils/api'

import { List, AutoSizer, WindowScroller } from 'react-virtualized';
import BASE_URL from '../../utils/url'

import HouseItem from '../../components/HouseItem'

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

    rowRenderer = ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // The List is currently being scrolled
        isVisible, // This row is visible within the List (eg it is not an overscanned row)
        style, // Style object to be applied to row (to position it)
    }) => {

        const { list } = this.state;
        const item = list[index];

        return <HouseItem
            key={item.houseCode}
            src={`${BASE_URL}${item.houseImg}`}
            title={item.title}
            desc={item.desc}
            tags={item.tags}
            price={item.price}
            onClick={() => console.log('点击房源！')}
        />;
    }

    render() {
        return (
            <div className={styles.houselistWrapper} >
                <div className={styles.header}>
                    <i className="iconfont icon-back" onClick={() => this.props.history.go(-1)}></i>
                    <SearchBox />
                </div>
                    {/* 筛选框 */}
                    <Filter onFilter={this.onFilter} />

                    <div className={styles.houseItems}>
                    <WindowScroller>
                        {({ height, isScrolling, registerChild, scrollTop }) => (
                            <AutoSizer>
                                {({ width }) => (
                                    <List
                                        ref={registerChild}
                                        width={width}
                                        height={height}
                                        rowCount={this.state.count}
                                        rowHeight={120}
                                        rowRenderer={this.rowRenderer}
                                        scrollTop={scrollTop}
                                        isScrolling={isScrolling}
                                    />
                                )}
                            </AutoSizer>
                        )}
                    </WindowScroller>
                </div>
            </div>
        )
    }
}
