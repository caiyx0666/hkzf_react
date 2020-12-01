import React, { Component } from 'react'

import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'



export default class FilterPicker extends Component {

  state = {
    value: this.props.defaultValue
  }

  onSave = () => {
    this.props.onSave(this.props.type, this.state.value);
  }

  render() {
    const { onCancel ,data, cols} = this.props;
    return (
      <>
        {/* 选择器组件： */}
        <PickerView data={data} value={this.state.value}
          onChange={(val) => {
            // console.log(val);
            this.setState({ value: val })
          }}
          cols={cols} />

        {/* 底部按钮 */}
        <FilterFooter onCancel={onCancel} onOk={this.onSave} />
      </>
    )
  }
}
