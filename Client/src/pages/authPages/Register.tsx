import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./auth.css";

const Register = (): JSX.Element => {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errMsg, setErrMsg] = useState({
    name: false,
    email: false,
    password: false,
  });

  const [serverErr, setServerErr] = useState(false);

  const nameLabel = useRef() as React.RefObject<HTMLLabelElement>;
  const emailLabel = useRef() as React.RefObject<HTMLLabelElement>;
  const passwordLabel = useRef() as React.RefObject<HTMLLabelElement>;
  const passwordInput = useRef() as React.RefObject<HTMLInputElement>;
  const navigate = useNavigate();

  const handelLabel = (input: string): void => {
    switch (input) {
      case "name":
        if (nameLabel.current) {
          nameLabel.current.classList.add("input-label-active");
        }
        break;
      case "email":
        if (emailLabel.current) {
          emailLabel.current.classList.add("input-label-active");
        }
        break;
      case "password":
        if (passwordLabel.current) {
          passwordLabel.current.classList.add("input-label-active");
        }
        break;
    }
  };

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    ev.target.setCustomValidity("");
    let tempInput = JSON.parse(JSON.stringify(input));
    tempInput[ev.target.id] = ev.target.value;
    setInput(tempInput);
  };

  const handleErrorMessage = (
    ev: React.FocusEvent<HTMLInputElement>,
    input: string
  ): void => {
    const findError = ev.target.validity;
    const tempErrMsg = { ...errMsg };
    if (
      findError.valueMissing ||
      findError.typeMismatch ||
      findError.patternMismatch ||
      findError.tooLong ||
      findError.tooShort ||
      findError.badInput
    ) {
      switch (input) {
        case "name":
          tempErrMsg.name = true;
          setErrMsg(tempErrMsg);
          if (!ev.target.value && nameLabel.current) {
            nameLabel.current.classList.remove("input-label-active");
          }
          break;
        case "email":
          tempErrMsg.email = true;
          setErrMsg(tempErrMsg);
          if (!ev.target.value && emailLabel.current) {
            emailLabel.current.classList.remove("input-label-active");
          }
          break;
        case "password":
          tempErrMsg.password = true;
          setErrMsg(tempErrMsg);
          if (!ev.target.value && passwordLabel.current) {
            passwordLabel.current.classList.remove("input-label-active");
          }
          break;
      }
    } else {
      switch (input) {
        case "name":
          tempErrMsg.name = false;
          setErrMsg(tempErrMsg);
          break;
        case "email":
          tempErrMsg.email = false;
          setErrMsg(tempErrMsg);
          break;
        case "pasword":
          tempErrMsg.password = false;
          setErrMsg(tempErrMsg);
          break;
      }
    }
  };

  const handleShowPassword = (): void => {
    if (passwordInput.current) {
      if (passwordInput.current.type === "text")
        passwordInput.current.type = "password";
      else if (passwordInput.current.type === "password")
        passwordInput.current.type = "text";
    }
  };

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>): void => {
    ev.preventDefault();
    axios
      .post("/auth/registeraaa", input)
      .then(() => navigate("/login"))
      .catch(() => setServerErr(true));
  };

  return (
    <div className="form-wrapper">
      <h3 className="form-title">Register</h3>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="input-container">
          <label className="input-label" htmlFor="name" ref={nameLabel}>
            Name:<span className="label-required">*required</span>
          </label>
          <input
            className="form-input"
            type="text"
            id="name"
            value={input.name}
            onChange={handleInputChange}
            pattern="^[a-zA-Z]*$"
            minLength={2}
            maxLength={16}
            onFocus={(): void => handelLabel("name")}
            onBlur={(ev: React.FocusEvent<HTMLInputElement>): void =>
              handleErrorMessage(ev, "name")
            }
            required
          />
        </div>
        {errMsg.name && (
          <span className="err-msg">
            Name must be 2-16 characters long and contain only latters.
          </span>
        )}
        <div className="input-container">
          <label className="input-label" htmlFor="email" ref={emailLabel}>
            Email:<span className="label-required">*required</span>
          </label>
          <input
            className="form-input"
            type="email"
            id="email"
            value={input.email}
            onChange={handleInputChange}
            pattern="^[a-z0-9][-a-z0-9._]+@([-a-z0-9]+[.])+[a-z]{2,5}$"
            onFocus={(): void => handelLabel("email")}
            onBlur={(ev: React.FocusEvent<HTMLInputElement>): void =>
              handleErrorMessage(ev, "email")
            }
            autoComplete="off"
            required
          />
        </div>
        {errMsg.email && (
          <span className="err-msg">Please enter a valid email.</span>
        )}
        <div className="input-container">
          <label className="input-label" htmlFor="password" ref={passwordLabel}>
            Password:<span className="label-required">*required</span>
          </label>
          <input
            className="form-input"
            type="password"
            id="password"
            value={input.password}
            onChange={handleInputChange}
            pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]*$"
            minLength={8}
            maxLength={64}
            onFocus={(): void => handelLabel("password")}
            onBlur={(ev: React.FocusEvent<HTMLInputElement>): void =>
              handleErrorMessage(ev, "password")
            }
            required
            ref={passwordInput}
            style={{ paddingRight: "2.5rem" }}
          />
          <span className="password-eye" onClick={handleShowPassword}>
            &#128065;
          </span>
        </div>
        {errMsg.password && (
          <span className="err-msg">
            Password must have 8+ characters, at least 1 number, 1 letter and 1
            special charater.
          </span>
        )}
        {serverErr && (
          <span className="err-msg" style={{ fontSize: "1.3rem" }}>
            Server Error Please Refresh Or Try Again Later!
          </span>
        )}
        <NavLink to="/login" className="forgot-link">
          Login With Google
        </NavLink>
        <button className="submit-btn">Register</button>
      </form>
    </div>
  );
};

export default Register;
