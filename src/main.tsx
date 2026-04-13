import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import RouterConfig from './config/router.config'
import { Provider } from 'react-redux'
import { store } from '../store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 3. Wrap your Router with the Provider and pass the store */}
    <Provider store={store}>
      <RouterConfig />
    </Provider>
  </StrictMode>,
)
