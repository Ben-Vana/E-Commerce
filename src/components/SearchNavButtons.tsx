import { NavLink, useLocation } from "react-router-dom";
import "../pages/searchPage/search.css";

interface buttonInterface {
  index: number;
  search: string | null;
}

const SearchNavButtons = ({ index, search }: buttonInterface): JSX.Element => {
  const location = useLocation();
  const qParams = new URLSearchParams(location.search);
  let isExact = false;
  if (qParams.get("p") === `${index}`) isExact = true;
  return (
    <>
      <NavLink
        className={isExact ? "active-button nav-button" : "nav-button"}
        to={search ? `/search?s=${search}&p=${index}` : "/"}
      >
        {index}
      </NavLink>
    </>
  );
};

export default SearchNavButtons;
