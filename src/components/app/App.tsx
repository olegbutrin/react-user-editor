import "./App.scss";
import Login from "../login/Login";
import { useSelector } from "../../services/hooks";
import { useEffect, useState } from "react";
import UserList from "../userlist/UserList";

const App = () => {
  const { tokenStatus, error } = useSelector((store) => store.app);
  const [logged, setLogged] = useState<boolean>(false);

  useEffect(() => {
    setLogged(tokenStatus === "success");
  }, [tokenStatus]);

  return (
    <div className={logged ? "AppUserList" : "AppLogin"}>
      {!logged && <Login status={tokenStatus} />}
      {logged && <UserList />}
      {error && <div className="Error">{error}</div>}
    </div>
  );
};

export default App;
