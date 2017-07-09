import React, { Component, PropTypes } from 'react'
import { connect } from './react-redux'
//导入connect
class Header extends Component {
  static contextTypes = {
    store: PropTypes.object
  }
  //可以看到Header删掉了大部分关于context的代码，
  //它除了props什么也不依赖，它是一个PuerComponent ，然后通过connect获取数据。
  //我们不需要知道connect是怎么和context打交道的，只要传一个mapStateToProps告诉它应该怎么取数据就可以了。同样的方式修改src/Content.js
  // constructor () {
  //   super()
  //   this.state = { themeColor: ''}
  // }

  // componentWillMount () {
  //   this._updateThemeColor()
  //   const { store } = this.context
  //   store.subscribe( ()=> this._updateThemeColor() )
  // }

  // _updateThemeColor () {
  //   const { store } = this.context
  //   const state = store.getState()
  //   this.setState({ themeColor:state.themeColor })
  // }
  render() {
    return (
      <h1 style={{ color:this.state.themeColor }} >React.js 小书</h1>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    themeColor: state.themeColor
  }
}

Header = connect(mapStateToProps)(Header)

export default Header