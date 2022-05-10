export type TRequestStatus = "initial" | "request" | "failed" | "success";
export type TLoginStatus = Omit<TRequestStatus, "rejected">;

export type TPreviewUser = number | null;

export type TUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  website: string;
  comment: string;
};

export type TRawLoginData = {
  status: "success" | "unauthorized" | "unknown";
  token: string;
}

export type TRawUserData = Array<TUser>;

export type TApiCallback<T> = (result: T) => void;

export type TFetchLogin = (
  onSuccess: TApiCallback<TRawLoginData>,
  onError: TApiCallback<string>,
  user: string, 
  pass: string,
) => void;

export type TFetchReconnect = (
  onSuccess: TApiCallback<TRawLoginData>,
  onError: TApiCallback<string>,
  user: string, 
) => void;

export type TFetchUsers = (
  onSuccess: TApiCallback<TRawUserData>,
  onError: TApiCallback<string>,
) => void;

export type TFetchSave = (
  onSuccess: TApiCallback<boolean>,
  onError: TApiCallback<string>,
) => void;

export type TAppStore = {
  token: string;
  tokenStatus: TLoginStatus;
  users: TRawUserData;
  usersStatus: TRequestStatus;
  preview: number | null;
  saveStatus: TRequestStatus;
  error: string;
}
