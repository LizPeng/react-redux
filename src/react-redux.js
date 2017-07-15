import React, { Component, PropTypes } from 'react'

export const connect = (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => {
  class Connect extends Component {
    //子组件要获取context里面的内容
    //就必须写contextTypes来声明和验证你需要获取状态的类型。
    static contextTypes = {
      store: PropTypes.object
    }
    constructor () {
        super()
        this.state = { allProps:{} }
    }

    componentWillMount () {
        const { store } = this.context //声明后可以额通过this.context获取到在index放置的 store
        this._updateProps()
        store.subscribe( ()=> this._updateProps() )//在数据变化时候重新调用updateProps()
    }

    _updateProps () {
        const { store } = this.context //从context里面把store取出来

        //额外传入props，让获取数据更加灵活方便
        //
        let stateProps = mapStateToProps
            ? mapStateToProps(store.getState(), this.props)
            : {} //防止mapStateToProps没有传入

        //dispatch action去改变颜色    
        let dispatchProps = mapDispatchToProps 
            ? mapDispatchToProps(store.dispatch, this.props)
            : {}
        this.setState({ 
            allProps:{ //整合普通的props和从state生成的props
                ...stateProps,
                ...dispatchProps,//新增加dispatchProps
                ...this.props
            }
         })
    }

    render () {
      return <WrappedComponent {...this.state.allProps} />
    }
  }
  return Connect
}

/////v5 新增provider,用来重构Index.js
//provider很简单，是一个容器组件，会把嵌套的内容作为自己的子组件渲染出来。它还会把外界传给它的props.store放到context，这样子组件connect的时候都可以获取到

export class Provider extends Component {
    static propTypes ={
        store: PropTypes.object,
        children: PropTypes.any
    }
    static childContextTypes = {
        store : PropTypes.store
    }

    getChildContext () {
        return {
            store: this.props.store
        }
    }

    render ()　{
        return (
            <div> {this.props.children} </div>
        )
    }
}