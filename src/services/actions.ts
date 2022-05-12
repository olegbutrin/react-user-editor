import { Dispatch } from "redux";
import * as constants from "./constants";
import { TUser } from "../types";
import { fetchLogin, fetchUsers, fetchUserUp } from "./api";

export interface ILoginRequest {
  readonly type: typeof constants.LOGIN_REQUEST;
}

export interface ILoginSuccess {
  readonly type: typeof constants.LOGIN_SUCCESS;
  readonly payload: string;
}

export interface ILoginError {
  readonly type: typeof constants.LOGIN_ERROR;
  readonly payload: string;
}

export interface ILoginReject {
  readonly type: typeof constants.LOGIN_REJECT;
}

export interface IUserRequest {
  readonly type: typeof constants.USERS_REQUEST;
}

export interface IUserSuccess {
  readonly type: typeof constants.USERS_SUCCESS;
  readonly payload: Array<TUser>;
}

export interface IUserError {
  readonly type: typeof constants.USERS_ERROR;
  readonly payload: string;
}

export interface ISaveRequest {
  readonly type: typeof constants.SAVE_REQUEST;
}

export interface ISaveSuccess {
  readonly type: typeof constants.SAVE_SUCCESS;
}

export interface ISaveError {
  readonly type: typeof constants.SAVE_ERROR;
  readonly payload: string;
}

export interface IPreviewUser {
  readonly type: typeof constants.PREVIEW_USER;
  readonly payload: number;
}

export interface IUpdateUser {
  readonly type: typeof constants.UPDATE_USER;
  readonly payload: TUser;
}

export interface IPingError {
  readonly type: typeof constants.PING_ERROR;
  readonly payload: string;
}

export type TAppActions =
  | ILoginRequest
  | ILoginSuccess
  | ILoginError
  | ILoginReject
  | IUserRequest
  | IUserSuccess
  | IUserError
  | ISaveRequest
  | ISaveSuccess
  | ISaveError
  | IPreviewUser
  | IUpdateUser
  | IPingError;

export const userLogin = (user: string, pass: string) => {
  return (dispatch: Dispatch) => {
    dispatch({ type: constants.LOGIN_REQUEST });
    fetchLogin(
      (data) => {
        switch (data.status) {
          case "success":
            dispatch({ type: constants.LOGIN_SUCCESS, payload: data.token });
            break;
          case "unauthorized":
            dispatch({ type: constants.LOGIN_REJECT });
            break;
          case "unknown":
            dispatch({ type: constants.LOGIN_ERROR, payload: "API Error!" });
            break;
        }
      },
      (data) => {
        dispatch({ type: constants.LOGIN_ERROR, payload: data });
      },
      user,
      pass
    );
  };
};

export const getUsers = (token: string) => {
  return (dispatch: Dispatch) => {
    dispatch({ type: constants.USERS_REQUEST });
    fetchUsers(
      (data) => {
        if (data.status === "success") {
          dispatch({ type: constants.USERS_SUCCESS, payload: data.data });
        } else {
          dispatch({ type: constants.LOGIN_REJECT });
        }
      },
      (error) => {
        dispatch({ type: constants.USERS_ERROR, payload: error });
      },
      token
    );
  };
};

export const pingServer = (token: string) => {
  return (dispatch: Dispatch) => {
    fetchUsers(
      (data) => {
        switch (data.status) {
          case "success":
            dispatch({ type: constants.LOGIN_SUCCESS, payload: data.token });
            break;
          case "unauthorized":
            dispatch({ type: constants.LOGIN_REJECT });
            break;
          case "unknown":
            dispatch({ type: constants.LOGIN_ERROR, payload: "API Error!" });
            break;
        }
      },
      (error) => {
        dispatch({ type: constants.PING_ERROR, payload: error });
      },
      token
    );
  };
};

export const uploadUser = (user: TUser, token: string) => {
  return (dispatch: Dispatch) => {
    dispatch({ type: constants.SAVE_REQUEST });
    fetchUserUp(
      (data) => {
        if (data.status === "success") {
          dispatch({ type: constants.SAVE_SUCCESS, payload: data.data });
        } else {
          dispatch({ type: constants.LOGIN_REJECT });
        }
      },
      (error) => {
        dispatch({ type: constants.SAVE_ERROR, payload: error });
      },
      user,
      token
    );
  };
};

export const setPreview = (id: number | null) => {
  return (dispatch: Dispatch) => {
    dispatch({ type: constants.PREVIEW_USER, payload: id });
  };
};

export const closePreview = () => {
  return setPreview(null);
};

export const updateUser = (user: TUser) => {
  return (dispatch: Dispatch) => {
    dispatch({ type: constants.UPDATE_USER, payload: user });
  };
};
