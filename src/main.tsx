
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import RouterPage from './pages/RouterPage'
import store from './store'
import 'bootstrap/dist/css/bootstrap.min.css';


ReactDOM.createRoot(document.getElementById('root')!).render(

  <Provider store={store}>
    <RouterPage />
  </Provider>
)
