import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./user.css";

interface userReviews {
  description: Array<string>;
  reported: boolean;
  rating: number;
  createdAt: string;
  productId: string;
  reviewId: string;
}

interface userInterface {
  _id: string;
  name: string;
  email: string;
  admin: boolean;
  createdAt: Date;
  userReviews: Array<userReviews>;
  reports: number;
}

const User = (): JSX.Element => {
  const [user, setUser] = useState<userInterface>();
  const [confirm, setConfirm] = useState(false);
  const [err, setErr] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const sortRef = useRef() as React.RefObject<HTMLDivElement>;

  useEffect((): void => {
    const param = new URLSearchParams(location.search);
    const uId = param.get("uid");
    axios
      .get(`/users/user/${uId}`)
      .then(({ data }) => {
        const date = new Date(data.createdAt);
        data.createdAt = date;
        setUser(data);
      })
      .catch(() => setErr(true));
  }, []);

  const handleDeleteReview = (
    pId: string,
    rId: string,
    revRate: number
  ): void => {
    const param = new URLSearchParams(location.search);
    const uId = param.get("uid");
    axios
      .post("/review/revtoken", {
        pid: pId,
        rid: rId,
        uid: uId,
        revRate,
      })
      .then(({ data }) => {
        axios
          .delete(`/review/deletereview/${data}`)
          .then(({ data }) => {
            data.createdAt = new Date(data.createdAt);
            setUser(data);
          })
          .catch(() => setErr(true));
      })
      .catch(() => setErr(true));
  };

  const handleOpenSort = () => {
    if (sortRef && sortRef.current) {
      if (sortRef.current.classList.contains("d-flex")) {
        sortRef.current.classList.remove("d-flex");
      } else {
        sortRef.current.classList.add("d-flex");
      }
    }
  };

  const handleSort = (sort: string): void => {
    const tempRev = JSON.parse(JSON.stringify(user));
    const date = new Date(tempRev.createdAt);
    tempRev.createdAt = date;
    if (tempRev.userReviews[0] && sort === "report") {
      tempRev.userReviews.sort(
        (a: userReviews, b: userReviews) => a.reported < b.reported
      );
      setUser(tempRev);
    } else if (tempRev.userReviews[0] && sort === "oldest") {
      tempRev.userReviews.sort(
        (a: userReviews, b: userReviews) =>
          new Date(a.createdAt) > new Date(b.createdAt)
      );
      setUser(tempRev);
    } else if (tempRev.userReviews[0] && sort === "recent") {
      tempRev.userReviews.sort(
        (a: userReviews, b: userReviews) =>
          new Date(a.createdAt) < new Date(b.createdAt)
      );
      setUser(tempRev);
    }
    if (sortRef && sortRef.current) sortRef.current.classList.remove("d-flex");
  };

  const handleDeleteUser = (): void => {
    const param = new URLSearchParams(location.search);
    const id = param.get("uid");
    if (user && id) {
      axios
        .delete(`/users/deleteuser/${id}`)
        .then(() => navigate("/dashboard/users"))
        .catch(() => setErr(true));
    }
  };

  const handleReset = (): void => {
    const param = new URLSearchParams(location.search);
    const id = param.get("uid");
    if (user && id) {
      axios
        .patch("/users/resetreports", { id })
        .then(() => window.location.reload())
        .catch(() => setErr(true));
    }
  };

  const handleAdmin = (): void => {
    const param = new URLSearchParams(location.search);
    const id = param.get("uid");
    if (user && id) {
      axios
        .patch("/users/switchadmin", { id })
        .then(() => window.location.reload())
        .catch(() => setErr(true));
    }
  };

  const handleUnreport = (
    ev: React.MouseEvent<HTMLButtonElement>,
    rId: string
  ): void => {
    const parent = (ev.target as HTMLButtonElement).parentElement;
    const param = new URLSearchParams(location.search);
    const id = param.get("uid");
    if (user && id) {
      axios.patch("/review/removereport", { uId: id, rId }).then(() => {
        if (ev.target && parent) {
          parent.style.border = "none";
          (ev.target as HTMLButtonElement).disabled = true;
          (ev.target as HTMLButtonElement).style.width = "10rem";
          (ev.target as HTMLButtonElement).innerText = "Refresh to see changes";
        }
      });
    }
  };

  return (
    <div className="user-page-container">
      {user && !err ? (
        <div className="user-info">
          <div>Name: {user.name}</div>
          <div>Email: {user.email}</div>
          <div>{user.admin ? "Admin" : "User"}</div>
          <div>
            CreatedAt:{" "}
            {`${user.createdAt.getDate()}/${
              user.createdAt.getMonth() + 1
            }/${user.createdAt.getFullYear()}`}
          </div>
          <div>Reports: {user.reports}</div>
          <div className="manage">
            <div className="up-btn-container">
              <button className="manage-btn" onClick={handleReset}>
                Reset Reports
              </button>
              <button className="manage-btn" onClick={handleAdmin}>
                {user.admin ? "Remove Admin" : "Add Admin"}
              </button>
            </div>
            <div>
              {confirm ? (
                <button
                  className="manage-btn up-del"
                  onClick={handleDeleteUser}
                >
                  <FontAwesomeIcon icon={faTriangleExclamation} />
                  Confirm delete
                </button>
              ) : (
                <button
                  className="manage-btn up-del"
                  onClick={(): void => setConfirm(true)}
                >
                  Delete User
                </button>
              )}
            </div>
          </div>
          <div className="rev-sort">
            <div className="under-l">Reviews:</div>
            <div className="rev-sort-options-wrapper">
              <span style={{ cursor: "pointer" }} onClick={handleOpenSort}>
                Sort &#709;
              </span>
              <div className="rev-sort-options" ref={sortRef}>
                <span
                  className="rev-sort-option"
                  onClick={() => handleSort("report")}
                >
                  Reported
                </span>
                <span
                  className="rev-sort-option"
                  onClick={() => handleSort("recent")}
                >
                  Most Recent
                </span>
                <span
                  className="rev-sort-option"
                  onClick={() => handleSort("oldest")}
                >
                  Oldest
                </span>
              </div>
            </div>
          </div>
          <div className="up-rev-container">
            {user.userReviews &&
              user.userReviews.map((item: userReviews, index) => (
                <div
                  key={item.createdAt + index}
                  className="up-rev"
                  style={item.reported ? { border: "1px solid #f00" } : {}}
                >
                  <div>{item.createdAt.split("T")[0].replace(/-/g, "/")}</div>
                  <div className="up-rev-desc">{item.description}</div>
                  {item.reported && (
                    <button
                      className="manage-btn up-unreport"
                      onClick={(ev) => handleUnreport(ev, item.reviewId)}
                    >
                      Unreport
                    </button>
                  )}
                  <div>
                    <button
                      className="up-confirm"
                      onClick={() =>
                        handleDeleteReview(
                          item.productId,
                          item.reviewId,
                          item.rating
                        )
                      }
                    >
                      Delete
                    </button>
                    <FontAwesomeIcon
                      className="rev-trash"
                      icon={faTrash}
                      onClick={(ev): void | null =>
                        ev.currentTarget.previousElementSibling &&
                        ev.currentTarget.previousElementSibling.classList.add(
                          "z-1"
                        )
                      }
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div className="server-error">Server Error Please Try Again Later!</div>
      )}
    </div>
  );
};

export default User;
