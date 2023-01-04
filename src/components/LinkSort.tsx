import { NavLink, match as Match } from "react-router-dom";
import "./navbar/navbar.css";

const LinkSort = ({ label, link }: { label: string; link: string }) => {
  return (
    <li className="nav-items">
      <NavLink
        isActive={(match: Match | null): boolean => {
          return match ? match && match.isExact : false;
        }}
        to={link}
        className="nav-links"
      >
        {label}
      </NavLink>
    </li>
  );
};

export default LinkSort;
