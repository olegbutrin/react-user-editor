import type { Middleware, MiddlewareAPI } from "redux";
import { AppDispatch, RootState, TApplicationActions } from "./store.types";
import * as constants from "./constants"
import { pingServer } from "./actions";

export const pingMiddleware = (): Middleware => {
  return (store: MiddlewareAPI<AppDispatch, RootState>) => {
    return (next) => (action: TApplicationActions) => {
      if (action.type === constants.PREVIEW_USER) {
        const { dispatch, getState } = store;
        const { app } = getState();
        if (app.preview === null) {
          dispatch(pingServer(app.token));
        }
      }
      next(action);
    };
  };
};
