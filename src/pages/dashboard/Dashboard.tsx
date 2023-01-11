import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./dashboard.css";

const Dashboard = (): JSX.Element => {
  const location = useLocation();
  return (
    <div className="dash-container">
      <div className="dash-nav">
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
