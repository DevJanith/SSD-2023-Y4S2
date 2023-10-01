import '@progress/kendo-theme-default/dist/all.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import 'simplebar/src/simplebar.css';
import App from './App';
import reducers from './reducers';

const store = createStore(reducers, compose(applyMiddleware(thunk)));

ReactDOM.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="1080426972385-5993vdo0adoqlb91gr31p6rmerk4ljt6.apps.googleusercontent.com">
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </GoogleOAuthProvider>
  </Provider>,
  document.getElementById('root')
);

