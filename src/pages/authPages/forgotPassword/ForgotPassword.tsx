import axios from "axios";
import { useRef, useState } from "react";
import "../auth.css";

const ForgotPassword = (): JSX.Element => {
  const [userEmail, setUserEmail] = useState("");
  const [emailSend, setEmailSend] = useState(false);
  const [error, setError] = useState("");

  const emailLabel = useRef() as React.RefObject<HTMLLabelElement>;

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>): void => {
    ev.preventDefault();
    axios
      .post("/auth/forgotpassword", { email: userEmail })
      .then(() => setEmailSend(true))
      .catch((err) => {
        if (err.response.data.error === "User not found") {
          setError("Email was not found");
        }
      });
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
        {error && (
          <span className="err-msg" style={{ margin: "-1rem" }}>
            {error}
          </span>
        )}
        {!emailSend ? (
          <button className="submit-btn">Send Email</button>
        ) : (
          <div
            style={{
              fontSize: "2rem",
              color: "#9336ff",
              boxShadow: "0 0 5px 2px #9336ff",
            }}
          >
            Check your mailbox
          </div>
        )}
      </form>
    </div>
  );
};

export default ForgotPassword;
