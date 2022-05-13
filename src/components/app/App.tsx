import "./App.scss";
import Login from "../login/Login";
import { useSelector } from "../../services/hooks";
import { useEffect, useState } from "react";
import UserList from "../userlist/UserList";
import Preview from "../preview/Preview";

const App = () => {
  const { tokenStatus, usersStatus, saveStatus, token, error, preview, users, findtext } =
    useSelector((store) => store.app);
  const [logged, setLogged] = useState<boolean>(false);
  const [requested, setRequested] = useState<boolean>(false);

  useEffect(() => {
    setLogged(tokenStatus === "success");
  }, [tokenStatus]);

  useEffect(() => {
    setRequested(
      tokenStatus === "request" ||
        usersStatus === "request" ||
        saveStatus === "request"
    );
  }, [tokenStatus, usersStatus, saveStatus]);

  return (
    <div className={logged ? "AppUserList" : "AppLogin"}>
      {!logged && <Login status={tokenStatus} />}
      {logged && (
        <UserList
          requested={requested}
          token={token}
          users={users}
          findtext={findtext}
        />
      )}
      {error && <div className="Error">{error}</div>}
      {preview !== null && (
        <Preview preview={preview} users={users} token={token} />
      )}
    </div>
  );
};

export default App;
