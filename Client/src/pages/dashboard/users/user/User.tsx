import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
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
  const location = useLocation();

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
      .catch((err) => console.log(err));
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
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
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

  const handleSort = (sort: string) => {
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
    }
    if (sortRef && sortRef.current) sortRef.current.classList.remove("d-flex");
  };

  return (
    <div className="user-page-container">
      {user ? (
        <div className="user-info">
          <div>Name: {user.name}</div>
          <div>Email: {user.email}</div>
          <div>
            CreatedAt:{" "}
            {`${user.createdAt.getDate()}/${
              user.createdAt.getMonth() + 1
            }/${user.createdAt.getFullYear()}`}
          </div>
          <div>Reports: {user.reports}</div>
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
                  <div>{item.createdAt.split("T")[0]}</div>
                  <div>{item.description}</div>

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
                    onClick={(ev) =>
                      ev.currentTarget.previousElementSibling &&
                      ev.currentTarget.previousElementSibling.classList.add(
                        "z-1"
                      )
                    }
                  />
                </div>
              ))}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default User;
