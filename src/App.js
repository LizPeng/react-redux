import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';

// class App extends Component {
//   render() {
//     return (
//       <div className="App">
//         <div className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           <h2>Welcome to React</h2>
//         </div>
//         <p className="App-intro">
//           To get started, edit <code>src/App.js</code> and save to reload.
//         </p>
//       </div>
//     );
//   }
// }

// export default App;
class App extends Component {
  constructor() {
    super()
    this.state = {name: 'World'}
  }
  handleClick() {
    this.setState({name:'World 2'})
  }
  render() {
    return (
      <div onclick={this.handleClick.bind(this)}>
        Hell {this.state.name}
      </div>
    )
  }
}
export default App