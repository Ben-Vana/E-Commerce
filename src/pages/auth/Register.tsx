import axios from "axios";
import { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import "./auth.css";

const Register = (): JSX.Element => {
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const passwordInput = useRef() as React.RefObject<HTMLInputElement>;
  const history = useHistory();

  const handleInputChange = (ev: React.ChangeEvent<HTMLInputElement>): void => {
    ev.target.setCustomValidity("");
    let tempInput = JSON.parse(JSON.stringify(input));
    tempInput[ev.target.id] = ev.target.value;
    setInput(tempInput);
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
      .post("/register", input)
      .then(() => history.push("/login"))
      .catch((error) => console.log(error));
  };

  return (
    <div className="form-wrapper">
      <h3>Register</h3>
      <form className="form-container" onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={input.name}
          onChange={handleInputChange}
          pattern="^[\D]*$"
          minLength={2}
          maxLength={16}
          onInvalid={(ev: React.InvalidEvent<HTMLInputElement>): void => {
            ev.target.setCustomValidity(
              "Name must be 2-16 charaters long and not contain any numbers"
            );
          }}
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={input.email}
          onChange={handleInputChange}
          pattern="^[a-z0-9][-a-z0-9._]+@([-a-z0-9]+[.])+[a-z]{2,5}$"
          onInvalid={(ev: React.InvalidEvent<HTMLInputElement>): void => {
            ev.target.setCustomValidity("Invalid Email");
          }}
          autoComplete="off"
          required
        />
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={input.password}
          onChange={handleInputChange}
          pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]*$"
          minLength={8}
          onInvalid={(ev: React.InvalidEvent<HTMLInputElement>): void => {
            ev.target.setCustomValidity(
              "Password must have 8+ characters, at least 1 number, and at least 1 letter."
            );
          }}
          required
          ref={passwordInput}
        />
        <span className="password-eye" onClick={handleShowPassword}>
          &#128065;
        </span>
        <button>Register</button>
      </form>
    </div>
  );
};

export default Register;
