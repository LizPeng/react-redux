#三： connect和mapStateToProps

我们来审查一下刚写下的这几个组件，可以轻易地发现它们有两个重大的问题：

1. **有大量重复的逻辑**：它们基础的逻辑都是，取出context，取出里面的store，然后用里面的状态设置自己的状态，这些代码逻辑其实都是相同的。
2. **对context依赖性国强**：这些组件都要依赖context来取数据，使得整个组件复用性基本为零。想一下，如果别人需要用到里面的ThemeSwitch组件，但是它们的组件并没有context也没有store，他们就没法用这个组件了。


对于第一个问题，我们在高阶组件的章节说过，可以把一些可复用的逻辑放在高阶组件当中，高阶组件包装的新组件和原来组件之间通过props传递信息，减少代码的重复程度。

对于第二个问题，我们得弄清楚一件事情，到底什么样的组件才叫做复用性强的组件。如果一个组件对外界的依赖过于强，那么这个组件的移植性会很差，就像这些严重依赖context的组件一样 。

如果一个组件的渲染只依赖于外界传进去的props和自己的state，而并不依赖于其他外界的任何数据，也就是说像纯函数一样，给它什么，它就吐出（渲染）什么出来。这种组件的复用性是最强的，别人使用时候根本不会担心任何事情，只要看看`PropTypes`它能接受说明参数，然后把参数穿进去控制它就行了。

我们把这种组件叫做Pure Component，因为它就像纯函数一样，可预测性非常强，对参数（props）以外的数据零依赖，也不产生副作用。这种组件一脚Dumb Component，因为他们呆呆的，让它干啥就干啥。写组件的时候尽量写Dumb Component会提高我们组件的可复用性。

到这里思路清晰了，我们需要高阶组件帮助我们从context取数据，我们也需要写Dumb组件帮助我们提高组件的复用性。所以我们尽量多地写Dumb组件，然后用高阶组件把它们包装一层，高阶组件和context打交道，把里面的数据取出来通过props传给Dumb组件。

![](http://huzidaha.github.io/static/assets/img/posts/ED7B72E6-73BE-429F-AE3C-F9C15C3BE35E.png)

我们把这个高阶组件起名字叫connect，因为它把Dumb组件和context链接起来了：

    import React, { Component, PropTypes } from 'react'
    
    export connect = (WrappedComponent)=>{
      class Connect extends Component {
	    static contextTypes = {
	      store: PropTypes.object
	    }
	    //TODO:如何从store获取数据
	    render () {
	      return <WrappedComponent />
	    }
      }
      return Connect
    }

connect函数接受一个组件WrappedComponent作为参数，把这个组件包含在一个新的组件Connect里面，Connect会去context里面取出store。现在要把store里面的数据取出来通过props传给WrappedComponent。

但是每个传进去的组件需要store里面的数据都不一样的，所以除了给高阶组件传入Dumb组件外，还需要告诉高阶组件我们需要什么数据，高阶组件才能正确地区取数据。为了解决这个问题，我们可以给高阶组件传入类似下面这样的函数：

    const mapStateToProps = (state) => {
      return {
    	themeColor: state.themeColor,
    	themeName: state.themeName,
    	fullName: `${state.firstName} ${state.lastName}`
      }
    }
    
    
这个函数会接受store.getState()的结果作为参数，然后返回一个对象，这个对象是根据state生成的。mapStateToProps相当于告知了Connect应该如何去store里面取数据，然后可以把这个函数的返回结果传给被包装的组件：


    const connect2 = (mapStateToProps) => (WrappedComponent) => {
      class Connect extends Component {
	    static contextTypes = {
	      store: PropTypes.object
 	   }
	    
	    render () {
		   const { store } = this.context 
		      let stateProps = mapStateToProps(store.getState())
		      //{...stateProps}意思是把这个对象里面的属性全部通过'props'方式传递进去
		      return <WrappedComponent {...stateProps} />
		    }
	      }
      return Connect
    }

connect现在是接受一个参数mapStateToProps，然后返回一个函数，这个返回的函数才是高阶组件。它会接受一个组件作为参数，然后用Connect组件包装以后再返回。

connect的用法是：

    const mapStateToProps = (state) => {
    	return {
    		themeColor: state.themeColor	
    	}
    }
    
    Header = connect(MapStateToProps)(Header)

我们把上面connect的函数代码单独分离到一个模块当中去，在`src/`目录下新建一个`react-redux.js`，把上面的connect函数的代码复制进去然后就可以在src/Header.js里面使用了

    import React, { Component, PropTypes } from 'react'
    import { connect } from './react-redux'
    
    class Header extends Component {
      static propTypes = {
   		 themeColor: PropTypes.string
      }
    
      render () {
	    return (
	      <h1 style={{ color: this.props.themeColor }}>React.js 小书</h1>
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

connect还没有监听数据变化然后重新渲染，所以现在点击按钮只有按钮会变颜色。我们给connect的高阶组件增加监听数据变化重新渲染的逻辑，稍微重构一下connect：

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

我们在Connect组件的constructor里面初始化了state.allProps，它是一个对象，用来保存需要传给被包装组件的所有的参数。生命周期componentWillMount会调用_updateProps进行初始化，然后通过store.subscribe监听数据变化重新调用_updateProps()

为了让connect返回新组件和被包装的组件使用参数保持一致，我们会把所有传给Connect的props原封不动的传给WrappedComponent。所以在 _updateProps 里面会把 stateProps 和 this.props 合并到 this.state.allProps 里面，再通过 render 方法把所有参数都传给 WrappedComponent。

mapStateToProps 也发生点变化，它现在可以接受两个参数了，我们会把传给 Connect 组件的 props 参数也传给它，那么它生成的对象配置性就更强了，我们可以根据 store 里面的 state 和外界传入的 props 生成我们想传给被包装组件的参数。

现在已经很不错了，Header.js 和 Content.js 的代码都大大减少了，并且这两个组件 connect 之前都是 Dumb 组件。接下来会继续重构 ThemeSwitch。