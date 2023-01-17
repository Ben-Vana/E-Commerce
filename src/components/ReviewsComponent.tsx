import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

interface reviewInterface {
  id: string;
  user: string;
  revBody: Array<string>;
  revRate: number;
}

const ReviewsComponent = ({
  id,
  user,
  revBody,
  revRate,
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
    </div>
  );
};

export default ReviewsComponent;
