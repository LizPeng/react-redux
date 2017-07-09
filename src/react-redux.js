import React, { Component, PropTypes } from 'react'

export const connect = (mapStateToProps) => (WrappedComponent) => {
  class Connect extends Component {
    static contextTypes = {
      store: PropTypes.object
    }
    constructor () {
        super()
        this.state = { allProps:{} }
    }

    componentWillMount () {
        const { store } = this.context
        this._updateProps()
        store.subscribe( ()=> this._updateProps() )
    }

    _updateProps () {
        const { store } = this.context
        let stateProps = mapStateToProps(store.getState(), this.props )//额外传入props，让获取数据更加灵活方便
        this.setState({ 
            allProps:{ //整合普通的props和从state生成的props
                ...stateProps,
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