import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./dashboard.css";

const Dashboard = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const dashHam = useRef() as React.RefObject<HTMLDivElement>;

  useEffect(() => {
    axios
      .get("/users/userinfo")
      .then(({ data }) => {
        if (data.admin === false) document.location.reload();
        else navigate("/dashboard/statistics");
      })
      .catch(() => navigate("/"));
  }, []);

  const handleDashHam = (ev: React.MouseEvent<HTMLDivElement>): void => {
    if (isOpen === false && ev.currentTarget.parentElement) {
      ev.currentTarget.parentElement.classList.remove("left");
      ev.currentTarget.style.left = "13rem";
      setIsOpen(true);
    } else if (isOpen === true && ev.currentTarget.parentElement) {
      ev.currentTarget.parentElement.classList.add("left");
      ev.currentTarget.style.left = "0";
      setIsOpen(false);
    }
  };

  const handleClose = (): void => {
    if (dashHam && dashHam.current && dashHam.current.parentElement) {
      dashHam.current.style.left = "0";
      dashHam.current.parentElement.classList.add("left");
      setIsOpen(false);
    }
  };

  return (
    <div className="dash-container">
      <div className="dash-nav left">
        <div
          className="dash-ham"
          onClick={(ev: React.MouseEvent<HTMLDivElement>) => handleDashHam(ev)}
          ref={dashHam}
        >
          <FontAwesomeIcon icon={faBars} />
        </div>
        <ul className="dash-list">
          <li className="dash-list-item active-item">
            <NavLink
              className={({ isActive }) =>
                isActive ? "dash-nav-link active-dash" : "dash-nav-link"
              }
              to="/dashboard/statistics"
              onClick={handleClose}
            >
              Statistics
            </NavLink>
          </li>
          <li className="dash-list-item">
            <NavLink
              className={({ isActive }) =>
                isActive ? "dash-nav-link active-dash" : "dash-nav-link"
              }
              to="/dashboard/manageproduct"
              onClick={handleClose}
            >
              Product manager
            </NavLink>
          </li>
          <li className="dash-list-item">
            <NavLink
              className={({ isActive }) =>
                isActive ? "dash-nav-link active-dash" : "dash-nav-link"
              }
              to="/dashboard/addproduct"
              onClick={handleClose}
            >
              Add Product
            </NavLink>
          </li>
          {location.pathname.includes("editproduct") && (
            <li className="dash-list-item">
              <span className="dash-nav-link active-dash">Edit Product</span>
            </li>
          )}
          <li className="dash-list-item">
            <NavLink
              className={({ isActive }) =>
                isActive ? "dash-nav-link active-dash" : "dash-nav-link"
              }
              to="/dashboard/users"
              onClick={handleClose}
            >
              Users
            </NavLink>
          </li>
        </ul>
      </div>
      <Outlet />
    </div>
  );
};

export default Dashboard;
