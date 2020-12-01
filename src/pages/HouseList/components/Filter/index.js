import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

import API from '../../../../utils/api'

import getCityInfo from '../../../../utils/getCityInfo'

const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false,
}

export default class Filter extends Component {

  componentDidMount(){
    this.getHouseFilter()
  }

  async getHouseFilter(){
    const {value} = await getCityInfo()
    const res = await API.get(`houses/condition?id=${value}`)
    this.setState({
      filterData: res.data.body
    })
  }

  onCancel = () => {
    this.setState({
      openType: ''
    })
  }

  onSave = () => {
    this.setState({
      openType: ''
    })
  }

  renderFilterPicker(){
    const { openType,filterData:{
      area,subway,rentType,price
    } } = this.state

    if(openType !== 'area' && openType !== 'mode' && openType !== 'price') return null

    let data = []
    let cols = 3

    switch(openType){
      case 'area':
        data = [area,subway]
        break;

      case 'mode':
        data= rentType
        break;

      case 'price':
        data = price
        cols = 1
        break;

      default: 
        break;
    }

    return <FilterPicker data={data} cols={cols} onCancel={this.onCancel} onSave={this.onSave} />
  }

  state = {
    titleSelectedStatus,
    openType: '',
    filterData: {}
  }

  onTitleClick = (type) => {
    this.setState({
      titleSelectedStatus: {
        ...titleSelectedStatus, [type]: true
      },
      openType: type
    })
  }

  handleClickMask = () => {
    this.setState({
      titleSelectedStatus: {
        area: false,
        mode: false,
        price: false,
        more: false,
      },
      openType: ''
    })
    console.log('1');
  }

  render() {
    const { openType } = this.state
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {  openType === 'area' || openType === 'mode'
          || openType === 'price' ? <div className={styles.mask} onClick={this.handleClickMask} /> : null}

        <div className={styles.content}>
          {/* 标题栏 */}
          <FilterTitle onClick={this.onTitleClick} titleSelectedStatus={this.state.titleSelectedStatus} />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
          {openType === 'more' ? <FilterMore onClick={this.handleMore} /> : null}
        </div>
      </div>
    )
  }
}
