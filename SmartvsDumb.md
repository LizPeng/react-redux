
大家已经知道，只会接受props并且渲染确定结果的组件我们把它叫做Dumb组件，这种组件只关心一件事情---根据props进行渲染。

Dumb组件最好不要依赖除了React.js和Dumb组件以外的内容。它们不要依赖Redux不要依赖React-redux。这样的组件的可复用性是组好的，其他人可以安心地使用而不用怕会引入什么奇奇怪怪的东西。

当我们拿到一个需求开始划分组件的时候，要认证考虑每个被划分组件的单元到底会不会被复用。如果这个组件可能会在多出被使用到，那么我们就把它做成Dumb组件。

我们可能拆分了一堆Dumb组件出来。但是单纯靠Dumb是没有办法构建应用程序的，因为它们实在太“笨”了，对数据的力量一无所知。所以还有一种组件，它们非常聪明smart，我们叫它们smart组件。它们专门做数据相关的应用逻辑，和各种数据打交道、和Ajax打交道，然后把数据通过props传递给Dumb，它们带领着Dumb组件完成了复杂的应用程序逻辑。

![](http://huzidaha.github.io/static/assets/img/posts/25608378-BE07-4050-88B1-72025085875A.png)


Smart组件不用考虑太多复用性问题，它们就是用来执行特定应用逻辑的。Smart组件可能组合了Smart组件和Dumb组件；但Dumb组件尽量不要依赖Smart组件。因为Dumb组件目的之一是为了复用，一旦它引用了Smart组件就相当于带入了一堆应用逻辑，导致它无法无用，所以尽量不要干这种事情。一个组件是Dumb的，那么它的子组件们都应该是dumb的才对。

## 划分Smart 和 Dumb 组件

知道了组件有这两种分类以后，我们来重新审视一下之前的make-react-redux工程里面的组件，例如src/Header.js

这个文件其实依赖了react-redux，别人使用的时候其实会带上这个依赖，所以这个组件不能叫做Dumb组件。但是你观察一下，这个组件在connect之前它是dumb的，就是因为connect了导致它和context扯上了关系，也使得这个组件没有了很好的复用性。

为了解决这个问题，我们把Smart和Dumb组件分开到不同的目录，不再在dumb组件内进行connect，在src/目录下创建两个文件夹components/和containers/ .

我们规定：**所有Dumb组件都放在components目录下，所有smart组件都放在containers下**，这是一种约定俗称的规则。

删除src/Header.js,新增 src/components/Header.js;

    import React, { Component, PropTypes } from 'react'
    
    export default class Header extends Component {
      static propTypes = {
   		 themeColor: PropTypes.string
      }
    
      render () {
	    return (
	      <h1 style={{ color: this.props.themeColor }}>React.js 小书</h1>
	    )
      }
    }

现在src/components/Header.js毫无疑问是一个Dumb组件，它除了依赖React.js什么都不依赖。我们新建src/container/Header.js,**这是一个与之对象的Smart组件**：

    import { connect } from 'react-redux'
    import Header from '../components/Header'
    
    const mapStateToProps = (state)=>{
      return {
    	themeColor: state.themeColor
      }
    }
    export default connect(mapStateToProps)(Header)

它会导入Dumb的header.js组件，进行connect变成Smart组件，然后把它导出模块。

这样我们就把Dumb组件抽离出来了，现在src/components/Header.js可复用性非常强，别的同事可以随意用它。而src/containers/Header.js则是跟业务相关的，我们只用在特定的应用场景下。

## 组件划分原则

看这个应用原来的组件树：


![](http://huzidaha.github.io/static/assets/img/posts/9271BF94-6599-4F73-A814-0DDA20B634D9.png)

对于Content这个组件，可以看到它是依赖ThemeSwitch组件的，这就需要好好思考一下了。我们分两种情况来讨论：Content**不服用**和**可复用**。

### Content不服用
如果产品场景并没有要求说Content需要复用，它只是在特定业务需要而已。那么没有必要把Content做成Dumb组件了，就让它成为一个Smart组件。因为Smart组件时可以使用Smart组件的，所以Content可以使用Dumb的ThemeSwitch组件coneect的结果。

新建一个src/componsnts/ThemeSwitch.js,这是一个Dumb的ThemeSwtich。

新建一个src/containers/ThemeSwitch.js,这是一个Smart的ThemeSwitch。

然后再用一个Smart的Content去使用它，新建src/containers/Content.js

这样就把这种业务场景下的Smart和Dumb组件分离开来了：

    > src
    > ├── components
    > │   ├── Header.js
    > │   └── ThemeSwitch.js
    > ├── containers
    > │   ├── Content.js
    > │   ├── Header.js
    > │   └── ThemeSwitch.js
    > └── index.js
    > 
    

### Content可复用

如果产品场景要求Content可能会被复用，那么Content就要是Dumb的。那么Content之下的子组件ThemeSwitch就一定要是Dumb，否则Content就没法复用了。这意味着ThemeSwitch不能connect，即使你connect了，Content也不能使用你connect的结果，因为connect的记过是个Smart组件。

这是哈ThemeSwitch的数据、onSwitchColor函数只能通过它的父组件传进来，而不是通过connect获得。所以只能让Content组件去connect，然后让它把数据、函数传给ThemeSwitch。

这种场景下的改造留作联系，最后的结果应该是：

    src
    ├── components
    │   ├── Header.js
    │   ├── Content.js
    │   └── ThemeSwitch.js
    ├── containers
    │   ├── Header.js
    │   └── Content.js
    └── index.js

可以看到对复用性的需求不同，会导致我们划分组件的方式不同。

#总结

根据是否需要高度的复用性，把组件划分为Dumb和Smart组件，约定俗称地把它们分别放到components和containers目录下。

Dumb基本只做一件事情--根据props进行渲染。而Smart则是负责应用的逻辑，数据，把所有相关的Dumb（Smart）组件组合起来，通过props控制它们。

Smart组件可以使用Smart、Dumb组件；而Dumb组件最好只使用Dumb组件，否则它的复用性就会丧失。

要根据应用场景不同划分组件，如果一个组件并不需要太强的复用性，直接让它成为Smart即可；否则就让它成为Dumb组件。

还有一点要注意,Smart组件并不意味着完全不能复用，Smart组件的复用是依赖场景的，在特定的应用场景下是当然可以复用Smart的。而Dumb则是可以跨应用场景复用，Smart和Dumb都可以复用，只是程度、场景不一样

