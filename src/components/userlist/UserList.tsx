import { useCallback, useEffect } from "react";
import { getUsers, setPreview } from "../../services/actions";
import { useDispatch, useSelector } from "../../services/hooks";
import { TUser } from "../../types";
import Spinner from "../spinner/Spinner";
import "./UserList.scss";

interface IUserCardItemComponent {
  name: string;
  value: string;
}

const UserCardItem = ({ name, value }: IUserCardItemComponent) => {
  return (
    <div className="UserCardItem">
      <div className="UserCardHeader">{name}</div>
      <div className="UserCardText">{value}</div>
    </div>
  );
};

interface IUserCardComponent {
  data: TUser;
}

const UserCard = ({ data }: IUserCardComponent) => {
  const dispatch = useDispatch();

  const onEditClick = useCallback(() => {
    dispatch(setPreview(data.id));
  }, [dispatch, data.id]);

  return (
    <div className="UserCard">
      <div className="UserCardPhotoBox"></div>
      <div className="UserCardBoxLeft">
        <UserCardItem
          key={"USER_FIRSTNAME"}
          name="First Name:"
          value={data.firstname}
        />
        <UserCardItem
          key={"USER_LASTNAME"}
          name="Last Name:"
          value={data.lastname}
        />
      </div>
      <div className="UserCardBoxRight">
        <UserCardItem
          key={"USER_WEBSITE"}
          name="Web Site:"
          value={data.website}
        />
        <UserCardItem key={"USER_EMAIL"} name="Email:" value={data.email} />
        <UserCardItem key={"USER_PHONE"} name="Phone:" value={data.phone} />
      </div>
      <div className="UserCardBoxBottom" onClick={onEditClick}>
        <button>Edit User</button>
      </div>
    </div>
  );
};

const UserList = () => {
  const dispatch = useDispatch();
  const { usersStatus, token, users } = useSelector((store) => store.app);

  useEffect(() => {
    dispatch(getUsers(token));
  }, [dispatch, token]);

  const fetchUserCallback = useCallback(() => {
    dispatch(getUsers(token));
  }, [dispatch, token]);

  return (
    <div className="UserList">
      <div className="UserHeader">
        <span className="UserHeaderText">User List</span>
        {usersStatus !== "request" && (
          <div className="button" onClick={fetchUserCallback}>
            ⭮
          </div>
        )}
        {usersStatus === "request" && <Spinner />}
      </div>
      {users.map((user) => {
        return <UserCard key={"USER_" + user.id} data={user} />;
      })}
    </div>
  );
};

export default UserList;
