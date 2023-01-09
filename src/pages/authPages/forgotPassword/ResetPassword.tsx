import { useNavigate, useParams } from "react-router-dom";
import { useState, useRef } from "react";
import axios from "axios";

const ResetPassword = (): JSX.Element => {
  const [password, setPassword] = useState({
    newPassword: "",
    checkPassword: "",
  });

  const [error, setError] = useState("");

  const navigate = useNavigate();

  const params = useParams();

  const newPasswordLabel = useRef() as React.RefObject<HTMLLabelElement>;
  const checkPasswordLabel = useRef() as React.RefObject<HTMLLabelElement>;
  const newPasswordInput = useRef() as React.RefObject<HTMLInputElement>;
  const checkPasswordInput = useRef() as React.RefObject<HTMLInputElement>;

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    let tempPassword = JSON.parse(JSON.stringify(password));
    tempPassword[ev.target.id] = ev.target.value;
    setPassword(tempPassword);
  };

  const handelLabel = (input: string): void => {
    switch (input) {
      case "newPassword":
        if (newPasswordLabel.current) {
          newPasswordLabel.current.classList.add("input-label-active");
        }
        break;
      case "checkPassword":
        if (checkPasswordLabel.current) {
          checkPasswordLabel.current.classList.add("input-label-active");
        }
        break;
    }
  };

  const handleBlur = (
    ev: React.FocusEvent<HTMLInputElement>,
    input: string
  ): void => {
    if (!ev.target.value) {
      if (input === "newPassword" && newPasswordLabel.current) {
        newPasswordLabel.current.classList.remove("input-label-active");
        return;
      } else if (input === "checkPassword" && checkPasswordLabel.current) {
        checkPasswordLabel.current.classList.remove("input-label-active");
      }
    }
  };

  const handleShowPassword = (input: string): void => {
    if (input === "newPassword") {
      if (newPasswordInput.current) {
        if (newPasswordInput.current.type === "text")
          newPasswordInput.current.type = "password";
        else if (newPasswordInput.current.type === "password")
          newPasswordInput.current.type = "text";
      }
    } else if (input === "checkPassword") {
      if (checkPasswordInput.current) {
        if (checkPasswordInput.current.type === "text")
          checkPasswordInput.current.type = "password";
        else if (checkPasswordInput.current.type === "password")
          checkPasswordInput.current.type = "text";
      }
    }
  };

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>): void => {
    ev.preventDefault();
    if (password.checkPassword === password.newPassword) {
      axios
        .post(`/resetpassword/${params.token}`, {
          password: password.newPassword,
        })
        .then(() => navigate("/login"))
        .catch((err) => {
          if (err.response.data.error.name === "TokenExpiredError") {
            setError(
              "Time limit has been reached, please try reseting the password again"
            );
            setInterval(() => {
              navigate("/forgotpassword");
            }, 5000);
          }
        });
    } else setError("Password does not match");
  };

  return (
    <div className="form-wrapper">
      <h3 className="form-title">Enter new password</h3>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="input-container">
          <label
            className="input-label"
            htmlFor="newPassword"
            ref={newPasswordLabel}
          >
            New Password:
          </label>
          <input
            className="form-input"
            type="password"
            id="newPassword"
            value={password.newPassword}
            minLength={8}
            maxLength={64}
            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]*$"
            onChange={handleInputChange}
            onFocus={(): void => handelLabel("newPassword")}
            onBlur={(ev: React.FocusEvent<HTMLInputElement>): void =>
              handleBlur(ev, "newPassword")
            }
            ref={newPasswordInput}
            required
          />
          <span
            className="password-eye"
            onClick={() => handleShowPassword("newPassword")}
          >
            &#128065;
          </span>
        </div>
        <div className="input-container">
          <label
            className="input-label"
            htmlFor="checkPassword"
            ref={checkPasswordLabel}
          >
            New Password:
          </label>
          <input
            className="form-input"
            type="password"
            id="checkPassword"
            value={password.checkPassword}
            minLength={8}
            maxLength={64}
            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]*$"
            onChange={handleInputChange}
            onFocus={(): void => handelLabel("checkPassword")}
            onBlur={(ev: React.FocusEvent<HTMLInputElement>): void =>
              handleBlur(ev, "checkPassword")
            }
            ref={checkPasswordInput}
            required
          />
          <span
            className="password-eye"
            onClick={() => handleShowPassword("checkPassword")}
          >
            &#128065;
          </span>
        </div>
        <div
          style={{
            color: "#fff",
            margin: "-1.4rem 0 -0.5rem 0",
            fontSize: "0.9rem",
          }}
        >
          *Password must be 8+ characters long have at least 1 number, 1 letter
          and 1 special charater
        </div>
        {error && (
          <span className="err-msg" style={{ marginTop: "0rem" }}>
            {error}
          </span>
        )}
        <button className="submit-btn">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
