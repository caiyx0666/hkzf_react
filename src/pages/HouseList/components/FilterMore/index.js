import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {
  state = {
    selectedValues: this.props.defaultValue
  }

  handleSelect(id){
    // console.log(id);
    const { selectedValues } = this.state
    if(selectedValues.some(item => item === id)){
      let index = selectedValues.findIndex(i => i === id)
      selectedValues.splice(index,1)
    }else{
      selectedValues.push(id)
    }

    this.setState({
      selectedValues: selectedValues
    })
  }

  // 渲染标签
  renderFilters(list) {
    // 高亮类名： styles.tagActive
    return (
      <div>
        {list.map(item => (
          <span key={item.value} 
            className={[styles.tag , this.state.selectedValues.includes(item.value) ? styles.tagActive : ''].join(' ')}
            onClick={this.handleSelect.bind(this, item.value)}
            >{item.label}</span>
        ))}
      </div>
      // <span className={[styles.tag, styles.tagActive].join(' ')}>东北</span>
    )
  }

  // 清除按钮点击事件
  onCancel =()=>{
    // 清空选择项
    this.setState({
      selectedValues: []
    },()=>{
      this.onSave()
    })
  }

  // 确认按钮点击事件
  onSave = () =>{
    this.props.onSave('more',this.state.selectedValues)
  }

  render() {
    const { roomType,oriented,floor,characteristic } = this.props
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={[styles.mask]} onClick={this.props.onCancel} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter 
          cancelText="清除"
          onCancel={this.onCancel}
          onOk={this.onSave}
          className={styles.footer} />
      </div>
    )
  }
}
