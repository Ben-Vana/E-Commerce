import { NavLink } from "react-router-dom";
import "./navbar/navbar.css";

const LinkSort = ({ label, link }: { label: string; link: string }) => {
  return (
    <li className="nav-items">
      <NavLink
        to={link}
        className={({ isActive }) =>
          isActive ? "nav-links active" : "nav-links"
        }
      >
        {label}
      </NavLink>
    </li>
  );
};

export default LinkSort;
