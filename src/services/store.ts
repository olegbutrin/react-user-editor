import { compose, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { pingMiddleware } from "./middleware";

import { rootReducer } from "./reducers";

const pingMW = pingMiddleware();

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(applyMiddleware(thunk, pingMW));

export const store = createStore(rootReducer, enhancer);