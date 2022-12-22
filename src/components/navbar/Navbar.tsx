import LinkSort from "../LinkSort";
import { useRef, useEffect, RefObject } from "react";
import { useSelector } from "react-redux";
import "./navbar.css";

const navLinks: [
  { label: string; link: string },
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
  {
    label: "Collection",
    link: "/collection",
  },
];

const adminLink: [{ label: string; link: string }] = [
  {
    label: "Dashboard",
    link: "/dashboard",
  },
];

const authLinks: {
  loggedIn: [{ label: string; link: string }];
  loggedOut: [{ label: string; link: string }, { label: string; link: string }];
} = {
  loggedIn: [
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
  const navBarContainerRef = useRef() as RefObject<HTMLDivElement>;
  const isLoggedIn = useSelector(
    (state: { authReducer: { login: boolean } }): boolean =>
      state.authReducer.login
  );

  const isAdmin = useSelector(
    (state: { authReducer: { userData: { admin: boolean } } }): boolean =>
      state.authReducer.userData.admin
  );

  let navSwitch = true;

  useEffect((): void => {
    //Responsive navbar
    if (navBarContainerRef.current) {
      if (window.outerWidth < 900) {
        navBarContainerRef.current.style.top = "-15rem";
        navBarContainerRef.current.style.visibility = "hidden";
      }
    }

    window.addEventListener("resize", (): void => {
      if (navBarContainerRef.current) {
        if (window.outerWidth > 900) {
          navBarContainerRef.current.style.top = "0";
          navBarContainerRef.current.style.visibility = "visible";
        } else {
          navBarContainerRef.current.style.visibility = "hidden";
          navBarContainerRef.current.style.top = "-15rem";
        }
      }
    });
  }, []);

  const handleOpenHamburger = (): void => {
    if (navBarContainerRef.current) {
      if (navBarContainerRef.current.style.visibility === "hidden") {
        navBarContainerRef.current.style.visibility = "visible";
      }

      if (navSwitch) {
        navBarContainerRef.current.style.top = "7vh";
        navSwitch = false;
        (
          document.body.getElementsByClassName(
            "main-div"
          ) as HTMLCollectionOf<HTMLElement>
        )[0].style.backgroundColor = "rgba(0,0,0,0.9)";
      } else if (!navSwitch) {
        navBarContainerRef.current.style.top = "-15rem";
        navSwitch = true;
        (
          document.body.getElementsByClassName(
            "main-div"
          ) as HTMLCollectionOf<HTMLElement>
        )[0].style.backgroundColor = "#333";
      }
    }
  };

  return (
    <>
      <nav className="main-nav">
        <div className="ham-container">
          <span className="ham" id="ham" onClick={handleOpenHamburger}>
            <img
              className="nav-svg"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iNTAiIGhlaWdodD0iNTAiCnZpZXdCb3g9IjAgMCA1MCA1MCI+CjxwYXRoIGQ9Ik0gMCA5IEwgMCAxMSBMIDUwIDExIEwgNTAgOSBaIE0gMCAyNCBMIDAgMjYgTCA1MCAyNiBMIDUwIDI0IFogTSAwIDM5IEwgMCA0MSBMIDUwIDQxIEwgNTAgMzkgWiI+PC9wYXRoPgo8L3N2Zz4="
              alt="svgImg"
            />
          </span>
        </div>
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
          <ul className="sec-row">
            {isLoggedIn
              ? authLinks.loggedIn.map((item, index) => (
                  <span key={item.label + index} className="logout">
                    {item.label}
                  </span>
                ))
              : authLinks.loggedOut.map((item, index) => (
                  <LinkSort
                    key={item.label + index}
                    label={item.label}
                    link={item.link}
                  />
                ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
