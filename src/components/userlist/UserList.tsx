import { KeyboardEvent, useCallback, useEffect, useState } from "react";
import {
  addUser,
  findText,
  getUsers,
  setPreview,
  updateUser,
  uploadUser,
} from "../../services/actions";
import { useDispatch } from "../../services/hooks";
import { TUser } from "../../types";
import Spinner from "../spinner/Spinner";
import "./UserList.scss";

interface IUserCardItemComponent {
  name: string;
  value: string;
  findtext: string;
}

const UserCardItem = ({ name, value, findtext }: IUserCardItemComponent) => {
  return (
    <div className="UserCardItem">
      <div className="UserCardHeader">{name}</div>
      <div
        className={
          "UserCardText" +
          (findtext.length &&
          value.toLowerCase().includes(findtext.toLowerCase())
            ? " marked"
            : "")
        }
      >
        {value}
      </div>
    </div>
  );
};

interface IUserCardComponent {
  data: TUser;
  token: string;
  findtext: string;
}

const UserCard = ({ data, token, findtext }: IUserCardComponent) => {
  const dispatch = useDispatch();

  const [remove, setRemove] = useState<boolean>(false);

  const onEditClick = useCallback(() => {
    dispatch(setPreview(data.id));
  }, [dispatch, data.id]);

  const onRemoveClick = useCallback(() => {
    if (remove) {
      data.removed = true;
      dispatch(uploadUser(data, token));
      dispatch(updateUser(data));
      setRemove(false);
    } else {
      setRemove(true);
    }
  }, [dispatch, data, token, remove, setRemove]);

  return (
    <div className="UserCard" data-userid={data.id}>
      <div className="UserCardPhotoBox"></div>
      <div className="UserCardBoxLeft">
        <UserCardItem
          key={"USER_FIRSTNAME"}
          name="First Name:"
          value={data.firstname}
          findtext={findtext}
        />
        <UserCardItem
          key={"USER_LASTNAME"}
          name="Last Name:"
          value={data.lastname}
          findtext={findtext}
        />
      </div>
      <div className="UserCardBoxRight">
        <UserCardItem
          key={"USER_WEBSITE"}
          name="Web Site:"
          value={data.website}
          findtext={findtext}
        />
        <UserCardItem
          key={"USER_EMAIL"}
          name="Email:"
          value={data.email}
          findtext={findtext}
        />
        <UserCardItem
          key={"USER_PHONE"}
          name="Phone:"
          value={data.phone}
          findtext={findtext}
        />
      </div>
      <div className="UserCardBoxBottom">
        <button className="edit" onClick={onEditClick}>
          Edit User
        </button>
        <button className="remove" onClick={onRemoveClick}>
          {remove ? "Sure to Remove?" : "Remove User"}
        </button>
      </div>
    </div>
  );
};

interface IUserListComponent {
  requested: boolean;
  token: string;
  users: Array<TUser>;
  findtext: string;
}

const UserList = ({
  requested,
  token,
  users,
  findtext,
}: IUserListComponent) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers(token));
  }, [dispatch, token]);

  const fetchUserCallback = useCallback(() => {
    dispatch(getUsers(token));
  }, [dispatch, token]);

  const addUserCallback = useCallback(() => {
    const newUser: TUser = {
      id: crypto.randomUUID(),
      firstname: "New",
      lastname: "User",
      email: "new@user.mail",
      phone: "+1234567890",
      website: "https://new.user",
      removed: false,
    };
    dispatch(uploadUser(newUser, token));
    dispatch(addUser(newUser));
    dispatch(setPreview(newUser.id));
  }, [dispatch, token]);

  const findUserCallback = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLInputElement;
      const winPos = window.pageYOffset + window.innerHeight;
      const str = target.value.toLowerCase();
      dispatch(findText(str));
      if (str && e.key === "Enter") {
        const userCards = document.querySelectorAll('div[class="UserCard"]');
        const ids = users
          .filter((user) => {
            return (
              user.firstname.toLowerCase().includes(str) ||
              user.lastname.toLowerCase().includes(str) ||
              user.email.toLowerCase().includes(str) ||
              user.phone.toLowerCase().includes(str) ||
              user.website.toLowerCase().includes(str)
            );
          })
          .map((user) => {
            return String(user.id);
          });
        if (ids.length) {
          target.classList.remove("failed");
          const filteredCards = Array.from(userCards).filter((card) => {
            const uid = String(card.getAttribute("data-userid"));
            return ids.includes(uid);
          });
          const nextCards = filteredCards.filter((card) => {
            return card.getBoundingClientRect().top + window.scrollY > winPos;
          });
          let nextCard = filteredCards[0];
          if (nextCards.length) {
            nextCard = nextCards[0];
          } else {
          }
          window.scrollTo({
            top: nextCard.getBoundingClientRect().top + window.scrollY - 144,
            behavior: "smooth",
          });
        } else {
          target.classList.add("failed");
        }
      } else {
        target.classList.remove("failed");
      }
    },
    [dispatch, users]
  );

  return (
    <>
      <div className="UserFix">
        <div className="UserHeader">
          <div className="UserHeaderText">User List</div>
          <div className="UserHeaderTools">
            <div className="button" onClick={addUserCallback}>
              +
            </div>
            <div className="SearchContainer">
              <input type={"search"} onKeyUp={findUserCallback}></input>
            </div>
          </div>
          <div className="UserHeaderUpdate">
            {!requested && (
              <div className="button" onClick={fetchUserCallback}>
                ⭮
              </div>
            )}
            {requested && <Spinner />}
          </div>
        </div>
      </div>
      <div className="UserList">
        {users.map((user) => {
          return !user.removed ? (
            <UserCard
              key={"USER_" + user.id}
              data={user}
              token={token}
              findtext={findtext}
            />
          ) : (
            ""
          );
        })}
      </div>
    </>
  );
};

export default UserList;
