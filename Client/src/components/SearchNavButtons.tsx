import { NavLink, useLocation } from "react-router-dom";
import "../pages/searchPage/search.css";

interface buttonInterface {
  index: number;
  search: string | null;
  sort: string | null;
}

const SearchNavButtons = ({
  index,
  search,
  sort,
}: buttonInterface): JSX.Element => {
  const location = useLocation();
  const qParams = new URLSearchParams(location.search);
  let isExactBtn = false;
  if (qParams.get("p") === `${index}`) isExactBtn = true;
  return (
    <>
      <NavLink
        className={({ isActive }) =>
          isActive && isExactBtn ? "active-button nav-button" : "nav-button"
        }
        to={search ? `/search?q=${search}&p=${index}&s=${sort}` : "/"}
      >
        {index}
      </NavLink>
    </>
  );
};

export default SearchNavButtons;
