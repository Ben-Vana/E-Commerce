import { useEffect, useState } from "react";
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

  useEffect((): void => {
    const param = new URLSearchParams(location.search);
    const uId = param.get("uid");
    axios
      .get(`/users/user/${uId}`)
      .then(({ data }) => {
        const a = new Date(data.createdAt);
        data.createdAt = a;
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
            const tempUser = JSON.parse(JSON.stringify(user));
            tempUser.userReviews = data.userReviews;
            tempUser.createdAt = new Date(tempUser.createdAt);
            setUser(tempUser);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
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
                  <div>
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() =>
                        handleDeleteReview(
                          item.productId,
                          item.reviewId,
                          item.rating
                        )
                      }
                    />
                  </div>
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
