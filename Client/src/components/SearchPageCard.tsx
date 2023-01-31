import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../pages/searchPage/search.css";

interface cardProp {
  id: string;
  name: string;
  price: string;
  rating: number;
  image: string;
  admin: { admin: boolean; delFunc: Function };
}

const SearchPageCard = ({
  id,
  name,
  price,
  rating,
  image,
  admin,
}: cardProp): JSX.Element => {
  const [confirmDelete, setDelete] = useState(false);
  return (
    <div className="row-card">
      <div className="image-container">
        <NavLink to={`/product?pid=${id}`}>
          <img
            className="card-image"
            src={`http://localhost:8181/public/images/${image}`}
            alt={name}
            crossOrigin="anonymous"
          />
        </NavLink>
      </div>
      <div className="card-content">
        <NavLink style={{ textDecoration: "none" }} to={`/product?pid=${id}`}>
          <h4 className="card-header" title={name}>
            {name}
          </h4>
        </NavLink>
        <div className="content-props">
          <div className="card-price">{price}$</div>
          {admin.admin && (
            <div className="admin-btn">
              <NavLink
                className="edit-button"
                style={{ textDecoration: "none" }}
                to={`/dashboard/editproduct/${id}`}
              >
                Edit
              </NavLink>
              {confirmDelete ? (
                <button
                  className="edit-button btn-confirm"
                  onClick={(): void => admin.delFunc(id)}
                >
                  Confirm Delete
                </button>
              ) : (
                <button
                  className="edit-button"
                  onClick={(): void => setDelete(true)}
                >
                  Delete
                </button>
              )}
            </div>
          )}
          {rating !== 0 && (
            <div>
              <FontAwesomeIcon
                icon={faStar}
                style={
                  Math.round(rating) >= 1
                    ? { color: "rgb(232, 185, 35)" }
                    : { color: "var(--main-background)" }
                }
              />
              <FontAwesomeIcon
                icon={faStar}
                style={
                  Math.round(rating) >= 2
                    ? { color: "rgb(232, 185, 35)" }
                    : { color: "var(--main-background)" }
                }
              />
              <FontAwesomeIcon
                icon={faStar}
                style={
                  Math.round(rating) >= 3
                    ? { color: "rgb(232, 185, 35)" }
                    : { color: "var(--main-background)" }
                }
              />
              <FontAwesomeIcon
                icon={faStar}
                style={
                  Math.round(rating) >= 4
                    ? { color: "rgb(232, 185, 35)" }
                    : { color: "var(--main-background)" }
                }
              />
              <FontAwesomeIcon
                icon={faStar}
                style={
                  Math.round(rating) === 5
                    ? { color: "rgb(232, 185, 35)" }
                    : { color: "var(--main-background)" }
                }
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPageCard;
