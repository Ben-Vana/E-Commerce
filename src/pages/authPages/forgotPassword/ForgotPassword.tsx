import axios from "axios";
import { useRef, useState } from "react";
import "../auth.css";

const ForgotPassword = (): JSX.Element => {
  const [userEmail, setUserEmail] = useState("");

  const emailLabel = useRef() as React.RefObject<HTMLLabelElement>;

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>): void => {
    ev.preventDefault();
    axios
      .post("/forgotpassword", { email: userEmail })
      .then((data) => console.log(data))
      .catch((error) => console.log(error));
  };

  return (
    <div className="form-wrapper">
      <h3 className="form-title">Enter your Email</h3>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="input-container">
          <label className="input-label" htmlFor="email" ref={emailLabel}>
            Email:
          </label>
          <input
            className="form-input"
            type="email"
            id="email"
            value={userEmail}
            pattern="^[a-z0-9][-a-z0-9._]+@([-a-z0-9]+[.])+[a-z]{2,5}$"
            onChange={(ev: React.ChangeEvent<HTMLInputElement>): void =>
              setUserEmail(ev.target.value)
            }
            autoComplete="off"
            onFocus={(): void | string =>
              emailLabel.current
                ? emailLabel.current.classList.add("input-label-active")
                : ""
            }
            onBlur={(ev: React.FocusEvent<HTMLInputElement>): void | string =>
              !ev.target.value && emailLabel.current
                ? emailLabel.current.classList.remove("input-label-active")
                : ""
            }
            required
          />
        </div>
        <button className="submit-btn">Send Email</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
