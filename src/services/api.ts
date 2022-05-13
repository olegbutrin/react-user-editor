import { TFetchLogin, TFetchUsers, TFetchUsersUp } from "../types";

const API_UID =
  "AKfycbyznTVCREgv0chNlhFryBEt4pUpTm_ekjKi4IKNnXRRehHTkb1K-kJgquPNj1QYdgk";
const API_URL = `https://script.google.com/macros/s/${API_UID}/exec`;

export const fetchLogin: TFetchLogin = (onSuccess, onError, user, pass) => {
  const url = new URL(API_URL);
  url.searchParams.set("action", "login");
  url.searchParams.set("user", encodeURIComponent(user));
  url.searchParams.set("pass", encodeURIComponent(pass));
  fetch(url.toString())
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Request failed: " + res.statusText);
      }
    })
    .then((data) => {
      onSuccess(data);
    })
    .catch((error: Error) => {
      onError(error.message);
    });
};

export const fetchUsers: TFetchUsers = (onSuccess, onError, token) => {
  const url = new URL(API_URL);
  url.searchParams.set("action", "getuser");
  url.searchParams.set("token", encodeURIComponent(token));
  fetch(url.toString())
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Request failed: " + res.statusText);
      }
    })
    .then((data) => {
      onSuccess(data);
    })
    .catch((error: Error) => {
      onError(error.message);
    });
};

export const fetchUserUp: TFetchUsersUp = (onSuccess, onError, user, token) => {
  const dataArr = [
    user.id,
    user.firstname,
    user.lastname,
    user.email,
    user.phone,
    user.website,
    user.removed ? user.removed : "",
  ];
  const url = new URL(API_URL);
  url.searchParams.set("action", "setuser");
  url.searchParams.set("token", encodeURIComponent(token));
  url.searchParams.set(
    "user",
    encodeURIComponent(btoa(JSON.stringify(dataArr)))
  );
  fetch(url.toString())
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Request failed: " + res.statusText);
      }
    })
    .then((data) => {
      onSuccess(data);
    })
    .catch((error: Error) => {
      onError(error.message);
    });
};

export const fetchPing: TFetchUsers = (onSuccess, onError, token) => {
  const url = new URL(API_URL);
  url.searchParams.set("action", "ping");
  url.searchParams.set("token", encodeURIComponent(token));
  fetch(url.toString())
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Request failed: " + res.statusText);
      }
    })
    .then((data) => {
      onSuccess(data);
    })
    .catch((error: Error) => {
      onError(error.message);
    });
};
