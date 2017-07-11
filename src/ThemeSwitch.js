import React, { Component, PropTypes } from 'react'
//重构，摆脱store.dispatch
import { connect } from './react-redux'

class ThemeSwitch extends Component {
  static propTypes = {
    themeColor:PropTypes.string,
    onSwitchColor:PropTypes.func
  }

  handleSwitchColor (color) {
    if(this.props.onSwitchColor){
      this.props.onSwitchColor(color)
    }
  }

  //dispatch action去改变颜色
  // handleSwitchColor (color) {
  //   const { store } = this.context
  //   store.dispatch({
  //     type:'CHANGE_COLOR',
  //     themeColor: color
  //   })
  // }

  render() {
    return (
      <div>
        <button 
          style={{ color:this.props.themeColor }} 
          onClick={this.handleSwitchColor.bind(this, 'red')} >Red</button>
        <button 
          style={{ color:this.props.themeColor }}
          onClick={this.handleSwitchColor.bind(this, 'blue')} >Blue</button>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    themeColor: state.themeColor
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSwitchColor:(color)=>{
      dispatch({ type: 'CHANGE_COLOR', themeColor: color })
    }
  }
}

ThemeSwitch = connect(mapStateToProps, mapDispatchToProps)(ThemeSwitch)
export default ThemeSwitch