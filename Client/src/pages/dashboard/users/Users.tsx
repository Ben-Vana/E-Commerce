import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import "./users.css";
import "../allProducts/allproducts.css";
import "./user/user.css";

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
      setInput(query);
      axios
        .get(`/users/username/${query}`)
        .then(({ data }) => {
          setUsers(data);
        })
        .catch((err) => console.log(err));
    } else setUsers([]);
  }, [location]);

  const handleKey = (ev: React.KeyboardEvent<HTMLInputElement>): void => {
    if (ev.code === "Enter") handleGetUser();
    else return;
  };

  const handleGetUser = () => navigate(`/dashboard/users?mq=${userInput}`);

  const handleSortByReport = () => {
    axios
      .get("/users")
      .then(({ data }) =>
        setUsers(
          data.sort((a: userProps, b: userProps) => a.reports < b.reports)
        )
      )
      .catch((err) => console.log(err));
  };

  return (
    <div className="users-container">
      <div className="ap-search">
        <div className="ap-input-container">
          <input
            type="text"
            name="user"
            id="user"
            placeholder="Seach User"
            className="ap-input"
            value={userInput}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
              setInput(ev.target.value)
            }
            onKeyDown={handleKey}
          />
          <div className="ap-icon-container" onClick={handleGetUser}>
            <FontAwesomeIcon
              className="ap-search-icon"
              icon={faMagnifyingGlass}
            />
          </div>
        </div>
      </div>
      <div className="up-sort-btn-container">
        <button className="manage-btn" onClick={handleSortByReport}>
          Sort By Reports
        </button>
      </div>
      <div className="search-page-container ap-res">
        {usersArr &&
          usersArr.map((item: userProps, index) => (
            <div key={item.name + index} className="user-card">
              <NavLink
                to={`/dashboard/users/user?uid=${item._id}`}
                className="user-name"
              >
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
