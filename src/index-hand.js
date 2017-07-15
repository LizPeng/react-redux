import React ,{ Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Header from './Header'
import Content from './Content'
import './index.css';
//v5头部引入provider
import { Provider } from './react-redux'

//加入createStore
function createStore (reducer) {
  let state = null
  const listeners = []
  const subscribe = (listener)=>listeners.push(listener)
  const getState = () => state 
  const dispatch = (action) => {
    state = reducer(state,action)
    listeners.forEach((listener) => listener())
  }
  dispatch({})
  return { getState, dispatch, subscribe }
}
//构建一个themeReducer来生成一个store
const themeReducer = (state, action) => {
  if(!state) return {
    themeColor: 'red'
  }
  switch (action.type) {
    case 'CHANGE_COLOR' :
      return { ...state, themeColor:action.themeColor }
    default:
      return state 
  }
}
const store = createStore(themeReducer)

class Index extends Component {

  //v5删除关于context的代码，以下注释部分
  //验证getChildContext返回的对象。是必须写的
  // static childContextTypes = {
  //   store: PropTypes.object
  // }
  // 这个方法是设置context的过程，它返回的对象就是context
  // 所有的子组件都可以访问到这个对象
  // getChildContext () {
  //   return { store }
  // }
  render () {
    return (
      <div>
        <Header />
        <Content />
      </div>
    )
  }
}
//v5把Provider作为子组件树的根节点
ReactDOM.render(
<Provider store={store}>
    <Index />
</Provider>, document.getElementById('root'));
