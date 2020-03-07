import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/Home.jsx';

// search-golf-app/public/index.html にある要素に DOM をレンダリング
// <Home />でHomeコンポーネントを呼び出している
ReactDOM.render(<Home/>, document.getElementById('root'));