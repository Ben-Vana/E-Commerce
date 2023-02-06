import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./users.css";
import "../allProducts/allproducts.css";

interface userProps {
  _id: string;
  name: string;
  email: string;
  reports: number;
}

const Users = (): JSX.Element => {
  const [usersArr, setUsers] = useState([]);
  const [userInput, setInput] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect((): void => {
    const param = new URLSearchParams(location.search);
    const query = param.get("mq");
    if (query) {
      axios
        .get(`/users/${query}`)
        .then(({ data }) => {
          console.log(data);
          setUsers(data);
        })
        .catch((err) => console.log(err));
    } else {
      axios
        .get(`/users`)
        .then(({ data }) => {
          console.log(data);
          setUsers(data);
        })
        .catch((err) => console.log(err));
    }
  }, [location]);

  const handleKey = (ev: React.KeyboardEvent<HTMLInputElement>): void => {
    if (ev.code === "Enter") handleGetProduct();
    else return;
  };

  const handleGetProduct = () => navigate(`/dashboard/users?mq=${userInput}`);

  return (
    <div className="users-container">
      <div className="ap-search">
        <div className="ap-input-container">
          <input
            type="text"
            name="product"
            id="product"
            placeholder="Seach User"
            className="ap-input"
            value={userInput}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
              setInput(ev.target.value)
            }
            onKeyDown={handleKey}
          />
          <div className="ap-icon-container" onClick={handleGetProduct}>
            <FontAwesomeIcon
              className="ap-search-icon"
              icon={faMagnifyingGlass}
            />
          </div>
        </div>
      </div>
      <div className="search-page-container ap-res">
        {usersArr &&
          usersArr.map((item: userProps, index) => (
            <div key={item.name + index} className="user-card">
              <NavLink to={`/user/${item._id}`} className="user-name">
                {item.name}
              </NavLink>
              <div className="user-card-props">
                <div>Email: {item.email}</div>
                <div>Reports: {item.reports}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Users;
