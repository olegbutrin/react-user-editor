import { combineReducers, Reducer } from "redux";
import * as constants from "./constants";
import { TAppStore } from "../types";
import { TAppActions } from "./actions";

export const initialState: TAppStore = {
  token: "",
  tokenStatus: "initial",
  users: [],
  usersStatus: "initial",
  saveStatus: "initial",
  preview: null,
  error: "",
  modified: false,
};

export const appReducer: Reducer<TAppStore, TAppActions> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case constants.LOGIN_REQUEST:
      return { ...state, tokenStatus: "request" };
    case constants.LOGIN_ERROR:
      return { ...state, tokenStatus: "failed", error: action.payload };
    case constants.LOGIN_SUCCESS:
      return { ...state, tokenStatus: "success", token: action.payload };
    case constants.LOGIN_REJECT:
      return { ...state, tokenStatus: "rejected", token: initialState.token };
    case constants.USERS_REQUEST:
      return { ...state, usersStatus: "request" };
    case constants.USERS_ERROR:
      return { ...state, usersStatus: "failed", error: action.payload };
    case constants.USERS_SUCCESS:
      return {
        ...state,
        usersStatus: "success",
        users: action.payload,
        modified: false,
      };
    case constants.SAVE_REQUEST:
      return { ...state, saveStatus: "request" };
    case constants.SAVE_ERROR:
      return { ...state, saveStatus: "failed", error: action.payload };
    case constants.SAVE_SUCCESS:
      return { ...state, saveStatus: "success", modified: false };
    case constants.PREVIEW_USER:
      return { ...state, preview: action.payload };
    case constants.UPDATE_USER:
      return {
        ...state,
        users: [
          ...state.users.map((user) => {
            return user.id === action.payload.id ? action.payload : user;
          }),
        ],
        preview: null,
        modified: true,
      };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({ app: appReducer });
