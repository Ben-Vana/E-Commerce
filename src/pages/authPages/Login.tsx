import axios from "axios";
import jwtDecode from "jwt-decode";
import useAutoLogin from "../../hooks/useAutoLogin";
import { useState, useEffect, useRef } from "react";
import { NavLink, useHistory } from "react-router-dom";
import "./auth.css";

declare global {
  const google: typeof import("google-one-tap");
}

const Login = (): JSX.Element => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [err, setErr] = useState(false);

  const history = useHistory();
  const autoLogin = useAutoLogin();
  const emailLabel = useRef() as React.RefObject<HTMLLabelElement>;
  const passwordLabel = useRef() as React.RefObject<HTMLLabelElement>;

  const handelLabel = (input: string): void => {
    switch (input) {
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

  const handleBlur = (
    ev: React.FocusEvent<HTMLInputElement>,
    input: string
  ): void => {
    if (!ev.target.value) {
      if (input === "email" && emailLabel.current) {
        emailLabel.current.classList.remove("input-label-active");
        return;
      } else if (input === "password" && passwordLabel.current) {
        passwordLabel.current.classList.remove("input-label-active");
      }
    }
  };

  useEffect((): void => {
    //Initialize google login
    google.accounts.id.initialize({
      client_id:
        "712814965942-30po1l77qvfhuehhebknuf56auctgpc8.apps.googleusercontent.com",
      callback: handleGoogleSignIn,
      auto_select: true,
    });
    //Create google button
    google.accounts.id.renderButton(
      document.getElementById("google-button") as HTMLDivElement,
      { theme: "outline", size: "large", locale: "en-us", shape: "pill" }
    );
  }, []);

  const handleGoogleSignIn = (res: { credential: string }): void => {
    interface genericObject {
      [key: string]: any;
    }
    const userData: genericObject = jwtDecode(res.credential);
    axios
      .post("/googlelogin", { name: userData.name, email: userData.email })
      .then(({ data }) => {
        localStorage.setItem("token", data.token);
        autoLogin();
        history.push("/");
      })
      .catch(() => setErr(true));
  };

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    let tempInput = JSON.parse(JSON.stringify(input));
    tempInput[ev.target.id] = ev.target.value;
    setInput(tempInput);
  };

  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>): void => {
    ev.preventDefault();
    axios
      .post("/login", input)
      .then(({ data }) => {
        localStorage.setItem("token", data.token);
        autoLogin();
        history.push("/");
      })
      .catch(() => setErr(true));
  };

  return (
    <div className="form-wrapper">
      <h3 className="form-title">Login</h3>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="input-container">
          <label className="input-label" htmlFor="email" ref={emailLabel}>
            Email:
          </label>
          <input
            className="form-input"
            type="email"
            id="email"
            value={input.email}
            onChange={handleInputChange}
            autoComplete="off"
            onFocus={(): void => handelLabel("email")}
            onBlur={(ev: React.FocusEvent<HTMLInputElement>): void =>
              handleBlur(ev, "email")
            }
            required
          />
        </div>
        <div className="input-container">
          <label className="input-label" htmlFor="password" ref={passwordLabel}>
            Password:
          </label>
          <input
            className="form-input"
            type="password"
            id="password"
            value={input.password}
            onChange={handleInputChange}
            onFocus={(): void => handelLabel("password")}
            onBlur={(ev: React.FocusEvent<HTMLInputElement>): void =>
              handleBlur(ev, "password")
            }
            required
          />
        </div>
        {err && <span className="err-msg">Email or Password are invalid.</span>}
        <button className="submit-btn">Login</button>
        <NavLink to="/forgotpassword" className="forgot-link">
          Forgot password?
        </NavLink>
        <div id="google-button"></div>
      </form>
    </div>
  );
};

export default Login;
