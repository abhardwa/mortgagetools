import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // or include from a CDN
// import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import './css/style.css';
import 'react-datepicker/dist/react-datepicker.css';
import {Provider} from 'react-redux';
import {store} from './store/store';
import TagManager from 'react-gtm-module';

const tagManagerArgs = {
  //Add GTM container ID
  gtmId: 'GTM-PKKP5XG'
};

TagManager.initialize(tagManagerArgs);

const el = document.getElementById('root');
const root = ReactDOM.createRoot(el);
// console.log("Inside index.js");
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);

