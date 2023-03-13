import LinkSort from "../LinkSort";
import { authActions } from "../../store/auth";
import { NavLink } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faBars,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useEffect, RefObject, useState } from "react";
import "./navbar.css";

const navLinks: [
  { label: string; link: string },
  { label: string; link: string }
] = [
  {
    label: "Home",
    link: "/",
  },
  {
    label: "About Us",
    link: "/aboutus",
  },
];

const adminLink: [{ label: string; link: string }] = [
  {
    label: "Dashboard",
    link: "/dashboard",
  },
];

const authLinks: {
  loggedIn: [{ label: string; link: string }, { label: string; link: string }];
  loggedOut: [{ label: string; link: string }, { label: string; link: string }];
} = {
  loggedIn: [
    {
      label: "cart",
      link: "/usercart",
    },
    {
      label: "Logout",
      link: "",
    },
  ],
  loggedOut: [
    {
      label: "Register",
      link: "/register",
    },
    {
      label: "Login",
      link: "/login",
    },
  ],
};

const Navbar = () => {
  const [searchInput, setSearchInput] = useState("");
  const [showSerach, setShowSerach] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  let navSwitch = true;

  const navBarContainerRef = useRef() as RefObject<HTMLDivElement>;
  const isLoggedIn = useSelector(
    (state: { authReducer: { login: boolean } }): boolean =>
      state.authReducer.login
  );

  const isAdmin = useSelector(
    (state: { authReducer: { userData: { admin: boolean } } }): boolean =>
      state.authReducer.userData.admin
  );

  window.addEventListener("resize", (): void => {
    if (navBarContainerRef.current) {
      if (window.outerWidth > 1000) {
        navBarContainerRef.current.style.top = "0";
        navBarContainerRef.current.style.visibility = "visible";
        setShowSerach(false);
      } else {
        navBarContainerRef.current.style.visibility = "hidden";
        navBarContainerRef.current.style.top = "-15rem";
        setShowSerach(true);
      }
    }
  });

  useEffect((): void => {
    //Responsive navbar
    if (navBarContainerRef.current) {
      if (window.outerWidth <= 1000) {
        navBarContainerRef.current.style.top = "-15rem";
        navBarContainerRef.current.style.visibility = "hidden";
        setShowSerach(true);
      }
    }

    const qParam = new URLSearchParams(location.search);
    const search = qParam.get("q");
    if (search) setSearchInput(search);
    else setSearchInput("");
  }, [location.search]);

  const handleOpenHamburger = (): void => {
    if (navBarContainerRef.current) {
      if (navBarContainerRef.current.style.visibility === "hidden") {
        navBarContainerRef.current.style.visibility = "visible";
      }

      if (navSwitch) {
        navBarContainerRef.current.style.top = "7.5vh";
        navSwitch = false;
        (
          document.body.getElementsByClassName(
            "main-div"
          ) as HTMLCollectionOf<HTMLElement>
        )[0].style.backgroundColor = "#212429";
        (
          document.body.getElementsByClassName(
            "main-content"
          ) as HTMLCollectionOf<HTMLElement>
        )[0].style.filter = "blur(4px)";
      } else if (!navSwitch) {
        navBarContainerRef.current.style.top = "-15rem";
        navSwitch = true;
        (
          document.body.getElementsByClassName(
            "main-div"
          ) as HTMLCollectionOf<HTMLElement>
        )[0].style.backgroundColor = "#272b30";
        (
          document.body.getElementsByClassName(
            "main-content"
          ) as HTMLCollectionOf<HTMLElement>
        )[0].style.filter = "blur(0)";
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(authActions.logout);
    window.location.reload();
  };

  return (
    <>
      <nav className="main-nav">
        <div className="ham-container">
          <span className="ham" id="ham" onClick={handleOpenHamburger}>
            <FontAwesomeIcon icon={faBars} className="nav-svg" />
          </span>
        </div>
        {showSerach && (
          <div className="search-container">
            <input
              type="search"
              className="nav-search"
              value={searchInput}
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                setSearchInput(ev.target.value)
              }
              onKeyDown={(
                ev: React.KeyboardEvent<HTMLInputElement>
              ): string | void =>
                ev.code !== "Enter"
                  ? ""
                  : !searchInput
                  ? navigate(`/`)
                  : navigate(`/search?q=${searchInput}&p=1`)
              }
            />
            <FontAwesomeIcon
              onClick={(): void =>
                !searchInput
                  ? navigate(`/`)
                  : navigate(`/search?q=${searchInput}&p=1`)
              }
              className="search-icon"
              icon={faMagnifyingGlass}
            />
          </div>
        )}
        <div className="nav" ref={navBarContainerRef}>
          <ul className="first-row">
            {navLinks.map((item, index) => (
              <LinkSort
                key={item.label + index}
                label={item.label}
                link={item.link}
              />
            ))}
            {isAdmin &&
              adminLink.map((item, index) => (
                <LinkSort
                  key={item.label + index}
                  label={item.label}
                  link={item.link}
                />
              ))}
          </ul>
          {!showSerach && (
            <ul className="search-container">
              <input
                type="search"
                className="nav-search"
                value={searchInput}
                onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchInput(ev.target.value)
                }
                onKeyDown={(
                  ev: React.KeyboardEvent<HTMLInputElement>
                ): string | void =>
                  ev.code !== "Enter"
                    ? ""
                    : !searchInput
                    ? navigate(`/`)
                    : navigate(`/search?q=${searchInput}&p=1`)
                }
              />
              <FontAwesomeIcon
                onClick={(): void =>
                  !searchInput
                    ? navigate(`/`)
                    : navigate(`/search?q=${searchInput}&p=1`)
                }
                className="search-icon"
                icon={faMagnifyingGlass}
              />
            </ul>
          )}
          <ul className="sec-row">
            {isLoggedIn
              ? authLinks.loggedIn.map((item, index) =>
                  item.label === "Logout" ? (
                    <span
                      key={item.label + index}
                      className="logout"
                      onClick={handleLogout}
                    >
                      {item.label}
                    </span>
                  ) : (
                    <NavLink
                      key={item.label + index}
                      to={item.link}
                      className="cart"
                    >
                      <FontAwesomeIcon icon={faCartShopping} />
                    </NavLink>
                  )
                )
              : authLinks.loggedOut.map((item, index) => (
                  <LinkSort
                    key={item.label + index}
                    label={item.label}
                    link={item.link}
                  />
                ))}
          </ul>
          <div className="rule"></div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
