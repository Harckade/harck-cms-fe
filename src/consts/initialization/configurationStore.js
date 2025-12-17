import { configureStore } from '@reduxjs/toolkit';
import {thunk} from 'redux-thunk';
import logger from 'redux-logger';
import createRootReducer from '../../reducers';

export default function configurationStore(initialState) {
  const middleware = [thunk];
  if (process.env.REACT_APP_ENVIRONMENT !== 'prod') {
    middleware.push(logger);
  }
  const store = configureStore({
    reducer: createRootReducer,
    middleware: (getDefaultMiddleware) => {
      // WARNING: this means that _none_ of the default middleware are added!
      return middleware
      // or for TS users, use:
      // return new Tuple(myMiddleware)
    },
    preloadedState: initialState
  });
  return store;
}
