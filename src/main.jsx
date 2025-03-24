import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import { store } from './store/store';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
      <Toaster position='top-center' reverseOrder={false} />
    <App />
  </Provider>
);
