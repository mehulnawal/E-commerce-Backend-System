import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider } from 'react-redux'
import store, { persistor } from './redux/store'
import { Bounce, ToastContainer } from 'react-toastify'

import { CookiesProvider } from 'react-cookie';
import { PersistGate } from 'redux-persist/integration/react'

const root = document.getElementById("root");

createRoot(root).render(
  <StrictMode>

    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />

    <CookiesProvider>
      <PersistGate persistor={persistor}>
        <Provider store={store}>
          <App />
        </Provider>
      </PersistGate>

    </CookiesProvider>
  </StrictMode>,
)
