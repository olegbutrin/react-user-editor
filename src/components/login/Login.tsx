import { FormEvent, useCallback } from "react";
import { userLogin } from "../../services/actions";
import { useDispatch } from "../../services/hooks";
import { TLoginStatus } from "../../types";
import Spinner from "../spinner/Spinner";
import "./Login.scss";

interface ILoginComponent {
  status: TLoginStatus;
}
const Login = ({ status }: ILoginComponent) => {
  const dispatch = useDispatch();
  // submit form
  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const data = new FormData(e.target as HTMLFormElement);
      const user = data.get("user") as string;
      const pass = data.get("pass") as string;
      dispatch(userLogin(user, pass));
      return false;
    },
    [dispatch]
  );

  return (
    <div className={["Login", status].join(" ")}>
      <div className={["LoginHeader", status].join(" ")}>
        <span>Authorization</span>
        {status === "request" && <Spinner />}
      </div>
      <form className="LoginForm" onSubmit={onSubmit}>
        <label htmlFor="user">User Name</label>
        <input
          id="user"
          name="user"
          type={"text"}
          defaultValue={"user"}
          required
        />
        <label htmlFor="pass">Password</label>
        <input
          id="pass"
          name="pass"
          type={"password"}
          defaultValue={"pass"}
          required
        />
        <input type={"submit"} value={"Sign In"}></input>
      </form>
    </div>
  );
};

export default Login;
