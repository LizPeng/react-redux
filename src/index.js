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
  static childContextTypes = {
    store: PropTypes.object
  }
  
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
