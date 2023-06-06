import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // or include from a CDN
// import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import './css/style.css';
import 'react-datepicker/dist/react-datepicker.css';

const el = document.getElementById('root');
const root = ReactDOM.createRoot(el);
console.log("Inside index.js");
root.render(
  <div>
    <App />
  </div>
);

