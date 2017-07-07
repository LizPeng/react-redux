import React ,{ Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Header from './Header'
import Content from './Content'
import './index.css';
// import App from './App';
// import registerServiceWorker from './registerServiceWorker';

class Index extends Component {
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
// registerServiceWorker();
