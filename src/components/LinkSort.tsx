import { NavLink, match as Match } from "react-router-dom";
import "./navbar/navbar.css";

const LinkSort = ({ label, link }: { label: string; link: string }) => {
  return (
    <li>
      <NavLink
        isActive={(match: Match | null, location: object): boolean => {
          return match ? match && match.isExact : false;
        }}
        to={link}
      >
        {label}
      </NavLink>
    </li>
  );
};

export default LinkSort;
