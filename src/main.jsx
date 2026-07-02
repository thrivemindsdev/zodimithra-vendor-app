import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';

import './index.css';
import App from './App.jsx';
import { store } from './redux/store';
import { NativeAppProvider } from './context/NativeAppContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <NativeAppProvider>
        <App />
      </NativeAppProvider>
    </Provider>
  </StrictMode>
);