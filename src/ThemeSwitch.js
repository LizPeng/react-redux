import React, { Component, PropTypes } from 'react'

class ThemeSwitch extends Component {
  static contextTypes = {
    store: PropTypes.object
  }

  constructor () {
    super()
    this.state = { themeColor: ''}
  }

  componentWillMount () {
    this._updateThemeColor()
    //给Header.js Content.js ThemeSwitch.js的componentWillMount生命周期
    //都加上监听数据变化重新渲染的代码：
    const { store } = this.context
    store.subscribe( ()=> this._updateThemeColor() )
  }

  _updateThemeColor () {
    const { store } = this.context
    const state = store.getState()
    this.setState({ themeColor: state.themeColor })
  }

  //dispatch action去改变颜色
  handleSwitchColor (color) {
    const { store } = this.context
    store.dispatch({
      type:'CHANGE_COLOR',
      themeColor: color
    })
  }

  render() {
    return (
      <div>
        <button 
          style={{ color:this.state.themeColor }} 
          onClick={this.handleSwitchColor.bind(this, 'red')} >Red</button>
        <button 
          style={{ color:this.state.themeColor }}
          onClick={this.handleSwitchColor.bind(this, 'blue')} >Blue</button>
      </div>
    )
  }
}

export default ThemeSwitch