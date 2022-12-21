import axios from "axios";
import jwtDecode from "jwt-decode";
import useAutoLogin from "../../hooks/useAutoLogin";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./auth.css";

declare global {
  const google: typeof import("google-one-tap");
}

const Login = (): JSX.Element => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const history = useHistory();
  const autoLogin = useAutoLogin();

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
      .catch((error) => console.log(error));
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
      .catch((error) => console.log(error));
  };

  return (
    <div className="form-wrapper">
      <h3>Login</h3>
      <form className="form-container" onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={input.email}
          onChange={handleInputChange}
          autoComplete="off"
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={input.password}
          onChange={handleInputChange}
          required
        />
        <button>Login</button>
        <div id="google-button"></div>
      </form>
    </div>
  );
};

export default Login;
