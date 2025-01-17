// // import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import { Provider } from 'react-redux';
// import store from './redux/store.js'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <Provider store={store}>
//     <App />
//     </Provider>,

// )

import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'; // Import PersistGate
import store, { persistor } from './redux/store.js'; // Import store and persistor
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <GoogleOAuthProvider clientId="403187377972-mvktu3lokmimpdtac4r12smo1slm8t71.apps.googleusercontent.com">
      <App />
      </GoogleOAuthProvider>
    </PersistGate>
  </Provider>
);
