import React ,{ Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Header from './Header'
import Content from './Content'
import './index.css';

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
  //验证getChildContext返回的对象。是必须写的
  static childContextTypes = {
    store: PropTypes.object
  }
  
  //这个方法是设置context的过程，它返回的对象就是context
  //所有的子组件都可以访问到这个对象
  getChildContext () {
    return { store }
  }
  render () {
    return (
      <div>
        <Header />
        <Content />
      </div>
    )
  }
}

ReactDOM.render(<Index />, document.getElementById('root'));
