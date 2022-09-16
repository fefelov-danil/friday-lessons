import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {HashRouter} from "react-router-dom";
import App from "n1-app/a1-ui/App";
import {Provider} from "react-redux";
import {store} from "n1-app/a2-bll/store";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
      <Provider store={store}>
          <HashRouter>
              <App />
          </HashRouter>
      </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your n1-app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
