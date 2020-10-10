import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import Login from './github-login';

console.log('👋 This message is being logged by "renderer.js", included via webpack');

ReactDOM.render(
  <div>
    <Login onSuccess={console.log} onFailure={console.warn} />
  </div>,
  document.querySelector('#app')
);
