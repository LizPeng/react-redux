import { connect } from 'react-redux'
import Header from '../components/Header'

const mapStateToProps = (state)=>{
  return {
    themeColor: state.themeColor
  }
}
//导入Dumb的header.js组件，进行connect变成Smart组件，然后把它导出模块。
export default connect(mapStateToProps)(Header)

