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

const selectedValues = {
  area: ['area', null],
  mode: ['null'],
  price: ['null'],
  more: []
}

export default class Filter extends Component {

  state = {
    titleSelectedStatus,
    openType: '',
    filterData: {},
    selectedValues
  }

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
    
    const { titleSelectedStatus, selectedValues } = this.state;

    let newTitleSelectedStatus = { ...titleSelectedStatus };

    // Object.keys(titleSelectedStatus) => ['area', 'mode', 'price', 'more']
    // key   area   mode   price   more 
    Object.keys(titleSelectedStatus).forEach((key) => {


      let selectedVal = selectedValues[key];

      if (key === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
        newTitleSelectedStatus[key] = true;
      } else if (key === 'mode' && (selectedVal[0] !== 'null')) {
        newTitleSelectedStatus[key] = true;
      } else if (key === 'price' && (selectedVal[0] !== 'null')) {
        newTitleSelectedStatus[key] = true;
      } else if (key === 'more' && selectedVal.length) {
        newTitleSelectedStatus[key] = true;
      } else {
        newTitleSelectedStatus[key] = false;
      }

    });

    this.setState({
      openType: '',
      titleSelectedStatus: newTitleSelectedStatus
    });
  }

  onSave = (type, value) => {
    console.log('我点击了确定按钮');
    const { titleSelectedStatus, selectedValues } = this.state;


    let newSelectedValues = {
      ...selectedValues,
      [type]: value
    }

    let newTitleSelectedStatus = { ...titleSelectedStatus };

    // Object.keys(titleSelectedStatus) => ['area', 'mode', 'price', 'more']
    // key   area   mode   price   more 
    Object.keys(titleSelectedStatus).forEach((key) => {


      let selectedVal = newSelectedValues[key];

      if (key === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')) {
        newTitleSelectedStatus[key] = true;
      } else if (key === 'mode' && (selectedVal[0] !== 'null')) {
        newTitleSelectedStatus[key] = true;
      } else if (key === 'price' && (selectedVal[0] !== 'null')) {
        newTitleSelectedStatus[key] = true;
      } else if (key === 'more' && selectedVal.length) {
        newTitleSelectedStatus[key] = true;
      } else {
        newTitleSelectedStatus[key] = false;
      }
    });

    this.setState({
      openType: '',
      selectedValues: newSelectedValues,
      titleSelectedStatus: newTitleSelectedStatus
    });
  }

  renderFilterPicker(){
    const {
      openType, filterData: {
        area, subway, rentType, price
      }, selectedValues
    } = this.state;

    if(openType !== 'area' && openType !== 'mode' && openType !== 'price') return null

    let data = []
    let cols = 3
    let defaultValue = selectedValues[openType];

    switch(openType){
      case 'area':
        data = [area,subway]
        break;

      case 'mode':
        data= rentType
        cols = 1
        break;

      case 'price':
        data = price
        cols = 1
        break;

      default: 
        break;
    }

    return <FilterPicker key={openType} defaultValue={defaultValue} data={data} cols={cols}
    onCancel={this.onCancel} onSave={this.onSave} type={openType} />
  }

  renderFilterMore() {
    const { openType, filterData: {
      roomType, oriented, floor, characteristic
    },selectedValues } = this.state;

    if (openType !== 'more') {
      return null;
    }

    let defaultValue = selectedValues.more

    return <FilterMore
      roomType={roomType}
      oriented={oriented}
      floor={floor}
      characteristic={characteristic} 
      onCancel={this.onCancel}
      onSave={this.onSave}
      defaultValue={defaultValue}
      />

  }

  /* 
   // 高亮：
   // selectedVal 表示当前 type 的选中值
   // 
   // 如果 type 为 area，此时，selectedVal.length !== 2 || selectedVal[0] !== 'area'，就表示已经有选中值
   // 如果 type 为 mode，此时，selectedVal[0] !== 'null'，就表示已经有选中值
   // 如果 type 为 price，此时，selectedVal[0] !== 'null'，就表示已经有选中值
   // 如果 type 为 more, ...
   实现步骤：
   1 在标题点击事件 onTitleClick 方法中，获取到两个状态：标题选中状态对象和筛选条件的选中值对象。
   2 根据当前标题选中状态对象，获取到一个新的标题选中状态对象（newTitleSelectedStatus）。
   3 使用 Object.keys() 方法，遍历标题选中状态对象。
   4 先判断是否为当前标题，如果是，直接让该标题选中状态为 true（高亮）。
   5 否则，分别判断每个标题的选中值是否与默认值相同。
   6 如果不同，则设置该标题的选中状态为 true。
   7 如果相同，则设置该标题的选中状态为 false。
   8 更新状态 titleSelectedStatus 的值为：newTitleSelectedStatus。
 */

  onTitleClick = (type) => {
    // console.log(type);
    const { titleSelectedStatus, selectedValues} = this.state
    let newTitleSelectedStatus = {...titleSelectedStatus}

    Object.keys(titleSelectedStatus).forEach(key => {
      if(type === key){
        newTitleSelectedStatus[key] = true
        return
      }
      let selectedVal = selectedValues[key]
      // console.log(selectedVal,key);
      // console.log(newTitleSelectedStatus);

      if(key === 'area' && (selectedVal.length !== 2 || selectedVal[0] !== 'area')){
        newTitleSelectedStatus[key] = true

      }else if(key === 'mode' && selectedVal[0] !== 'null'){
        newTitleSelectedStatus[key] = true

      }else if(key === 'price' && selectedVal[0] !== 'null'){
        newTitleSelectedStatus[key] = true

      }else if (key === 'more' && selectedVal.length) {
        newTitleSelectedStatus[key] = true;

      }else{
        newTitleSelectedStatus[key] = false

      }
    })


    this.setState({
      titleSelectedStatus: newTitleSelectedStatus,
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
          {this.renderFilterMore()}
        </div>
      </div>
    )
  }
}
