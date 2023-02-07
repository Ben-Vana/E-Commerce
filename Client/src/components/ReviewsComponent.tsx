import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faFlag } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface reviewInterface {
  userId: string;
  revId: string;
  user: string;
  revBody: Array<string>;
  revRate: number;
  report: Function;
}

const ReviewsComponent = ({
  userId,
  revId,
  user,
  revBody,
  revRate,
  report,
}: reviewInterface): JSX.Element => {
  const [reported, setReported] = useState(false);
  return (
    <div className="review-comp-wrapper">
      <h4 className="review-username">{user}</h4>
      <div>
        <FontAwesomeIcon
          icon={faStar}
          style={
            revRate >= 1
              ? { color: "#e8b923" }
              : { color: "var(--main-background)" }
          }
        />
        <FontAwesomeIcon
          icon={faStar}
          style={
            revRate >= 2
              ? { color: "#e8b923" }
              : { color: "var(--main-background)" }
          }
        />
        <FontAwesomeIcon
          icon={faStar}
          style={
            revRate >= 3
              ? { color: "#e8b923" }
              : { color: "var(--main-background)" }
          }
        />
        <FontAwesomeIcon
          icon={faStar}
          style={
            revRate >= 4
              ? { color: "#e8b923" }
              : { color: "var(--main-background)" }
          }
        />
        <FontAwesomeIcon
          icon={faStar}
          style={
            revRate >= 5
              ? { color: "#e8b923" }
              : { color: "var(--main-background)" }
          }
        />
      </div>
      <div className="review-description">{revBody.join(" ")}</div>
      <button
        title="Report as Inappropriate"
        className="delete-review"
        style={reported ? { color: "rgba(255,0,0,0.25)" } : {}}
        onClick={(): void => {
          report(userId, revId);
          setReported(true);
        }}
        disabled={reported ? true : false}
      >
        <FontAwesomeIcon icon={faFlag} />
      </button>
    </div>
  );
};

export default ReviewsComponent;
