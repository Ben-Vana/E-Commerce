import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrash, faFlag } from "@fortawesome/free-solid-svg-icons";

interface reviewInterface {
  userId: string;
  revId: string;
  user: string;
  revBody: Array<string>;
  revRate: number;
  admin: boolean;
  deleteRev: Function;
}

const ReviewsComponent = ({
  userId,
  revId,
  user,
  revBody,
  revRate,
  admin,
  deleteRev,
}: reviewInterface): JSX.Element => {
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
      {admin ? (
        <button
          onClick={() => deleteRev(revId, userId)}
          className="delete-review"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      ) : (
        <button title="Report" className="delete-review">
          <FontAwesomeIcon icon={faFlag} />
        </button>
      )}
    </div>
  );
};

export default ReviewsComponent;
