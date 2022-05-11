import {
  FormEvent,
  HTMLInputTypeAttribute,
  KeyboardEvent,
  SyntheticEvent,
  UIEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { closePreview, updateUser, uploadUser } from "../../services/actions";
import { useDispatch } from "../../services/hooks";
import { TUser } from "../../types";
import "./Preview.scss";

const modalRoot: HTMLElement =
  document.getElementById("modal") || document.body;

interface IUserFormItemComponent {
  name: string;
  type: HTMLInputTypeAttribute;
  value: string;
}

const UserFormItem = ({ name, type, value }: IUserFormItemComponent) => {
  const id = name.replace(/\s/g, "").replace(/:/g, "").toLowerCase();
  return (
    <div className="UserFormItem">
      <label htmlFor={id} className="UserFormLabel">
        {name}
      </label>
      <input id={id} name={id} type={type} defaultValue={value}></input>
    </div>
  );
};

interface IUserFormComponent {
  user: TUser;
  onSave: (user: TUser) => void;
  onClose: () => void;
}

interface INativeEvent extends Event {
  submitter: {
    value: string;
  };
}

const UserForm = ({ user, onSave, onClose }: IUserFormComponent) => {
  const onSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const native = e.nativeEvent as INativeEvent;
      const value = native.submitter.value;
      if (value === "Save") {
        const data = new FormData(e.target as HTMLFormElement);
        const firstname = data.get("firstname") as string;
        const lastname = data.get("lastname") as string;
        const email = data.get("email") as string;
        const phone = data.get("phone") as string;
        const website = data.get("website") as string;
        const edited = {
          ...user,
          firstname: firstname,
          lastname: lastname,
          email: email,
          phone: phone,
          website: website,
        };
        onSave(edited);
      } else {
        onClose();
      }
    },
    [onSave, onClose, user]
  );

  return (
    <form className="UserForm" onSubmit={onSubmit}>
      <div className="UserFormBoxLeft">
        <UserFormItem
          key={"USER_FIRSTNAME"}
          name="First Name:"
          value={user.firstname}
          type={"text"}
        />
        <UserFormItem
          key={"USER_LASTNAME"}
          name="Last Name:"
          value={user.lastname}
          type={"text"}
        />
      </div>
      <div className="UserFormBoxRight">
        <UserFormItem
          key={"USER_WEBSITE"}
          name="Website:"
          value={user.website}
          type={"text"}
        />
        <UserFormItem
          key={"USER_EMAIL"}
          name="Email:"
          value={user.email}
          type={"text"}
        />
        <UserFormItem
          key={"USER_PHONE"}
          name="Phone:"
          value={user.phone}
          type={"text"}
        />
      </div>
      <div className="UserFormBoxBottom">
        <input id={"userid"} name={"userid"} type={"hidden"} value={user.id} />
        <input className="FormSubmit" type={"submit"} value={"Save"} />
        <input className="FormCancel" type={"submit"} value={"Cancel"} />
      </div>
    </form>
  );
};

interface IPreviewComponent {
  preview: number;
  users: Array<TUser>;
  token: string;
}

const Preview = ({ preview, users, token }: IPreviewComponent) => {
  const dispatch = useDispatch();

  const [data, setData] = useState<TUser | null>(null);

  useEffect(() => {
    setData(
      users.find((user) => {
        return user.id === preview;
      }) || null
    );
  }, [preview, users, setData]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref != null && ref.current) {
      ref.current.focus();
    }
  }, []);

  const saveUser = useCallback(
    (user: TUser) => {
      dispatch(uploadUser(user, token));
      dispatch(updateUser(user));
    },
    [dispatch, token]
  );

  const closeModal = useCallback(() => {
    dispatch(closePreview());
  }, [dispatch]);

  const stopEvent = useCallback((e: UIEvent<HTMLElement>) => {
    e.stopPropagation();
  }, []);

  const closeMouseCallback = useCallback(
    (e: SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      closeModal();
    },
    [closeModal]
  );

  const closeKeyboardCallback = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        closeModal();
      }
    },
    [closeModal]
  );

  const contents = (
    <div className="Overlay" onClick={closeMouseCallback}>
      <div className="Preview" onClick={stopEvent}>
        <div className="PreviewHeader">
          <span>User Data:</span>
          <div
            className="close"
            tabIndex={0}
            ref={ref}
            onClick={closeMouseCallback}
            onKeyUp={closeKeyboardCallback}
          >
            🗙
          </div>
        </div>
        {data && (
          <UserForm user={data} onClose={closeModal} onSave={saveUser} />
        )}
      </div>
    </div>
  );
  return createPortal(contents, modalRoot);
};

export default Preview;
