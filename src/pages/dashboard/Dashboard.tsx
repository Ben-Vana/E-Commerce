import { NavLink, Outlet, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import "./dashboard.css";

const Dashboard = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleDashHam = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (isOpen === false && ev.currentTarget.parentElement) {
      ev.currentTarget.parentElement.style.left = "0";
      setIsOpen(true);
    } else if (isOpen === true && ev.currentTarget.parentElement) {
      ev.currentTarget.parentElement.style.left = "-30vw";
      setIsOpen(false);
    }
  };

  return (
    <div className="dash-container">
      <div className="dash-nav">
        <div
          className="dash-ham"
          onClick={(ev: React.MouseEvent<HTMLDivElement>) => handleDashHam(ev)}
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
            >
              Statistics
            </NavLink>
          </li>
          <li className="dash-list-item">
            <NavLink
              className={({ isActive }) =>
                isActive ? "dash-nav-link active-dash" : "dash-nav-link"
              }
              to="/dashboard/addproduct"
            >
              Add Product
            </NavLink>
          </li>
          {location.pathname.includes("editproduct") && (
            <li className="dash-list-item">
              <span className="dash-nav-link active-dash">Edit Product</span>
            </li>
          )}
          <li className="dash-list-item">Users</li>
        </ul>
      </div>
      <Outlet />
    </div>
  );
};

export default Dashboard;
