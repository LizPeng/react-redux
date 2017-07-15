import React, { Component, PropTypes } from 'react'

export default class Header extends Component {
  static propTypes = {
    themeColor: PropTypes.string
  }
  render() {
    return (
      <h1 style={{ color:this.props.themeColor }} >React.js 小书</h1>
    )
  }
}

//v7 用原生的redux 
// const mapStateToProps = (state) => {
//   return {
//     themeColor: state.themeColor
//   }
// }

// Header = connect(mapStateToProps)(Header)

// export default Header