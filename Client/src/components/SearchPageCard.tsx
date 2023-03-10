import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import "../pages/searchPage/search.css";

interface cardProp {
  id: string;
  name: string;
  price: string;
  rating?: number;
  image: string;
  quantity?: number;
  adminEdit?: Function;
  user?: Function;
  handleQuantity?: Function;
  addView?: Function;
}

const SearchPageCard = ({
  id,
  name,
  price,
  rating,
  image,
  quantity,
  adminEdit,
  user,
  handleQuantity,
  addView,
}: cardProp): JSX.Element => {
  const [confirmDelete, setDelete] = useState(false);

  const handleQuantityOptions = (): JSX.Element[] => {
    let optionsArr = [];
    if (quantity !== undefined) {
      const length = quantity > 10 ? 10 : quantity;
      for (let i = 1; i <= length; i++) {
        optionsArr.push(
          <option key={"option" + i} value={i}>
            {i}
          </option>
        );
      }
    }
    return optionsArr;
  };

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
        <NavLink
          style={{ textDecoration: "none" }}
          to={`/product?pid=${id}`}
          onClick={(): void => (addView ? addView(id) : "")}
        >
          <h4 className="card-header" title={name}>
            {name}
          </h4>
        </NavLink>
        {adminEdit && quantity !== undefined && quantity < 1 && (
          <div
            className="out-stock none"
            style={{ color: "rgba(255,0,0,0.6)" }}
          >
            Out of stock!
          </div>
        )}
        {quantity !== undefined &&
          handleQuantity &&
          adminEdit === undefined && (
            <div className="checkout-props">
              <div className="card-price">{price}$</div>
              {quantity < 1 ? (
                <div style={{ color: "rgba(255,0,0,0.6)" }}>Out of stock!</div>
              ) : (
                <div className="user-quantity">
                  <label htmlFor="quantity">Quantity:</label>
                  <select
                    className="quantity-select"
                    name="quantity"
                    id="quantity"
                    onChange={(ev: React.ChangeEvent<HTMLSelectElement>) =>
                      handleQuantity(ev, id)
                    }
                  >
                    {handleQuantityOptions()}
                  </select>
                </div>
              )}
            </div>
          )}
        <div className="content-props">
          {quantity === undefined && <div className="card-price">{price}$</div>}
          {adminEdit && <div className="card-price">{price}$</div>}
          {adminEdit && quantity !== undefined && quantity < 1 && (
            <div className="out-stock" style={{ color: "rgba(255,0,0,0.6)" }}>
              Out of stock!
            </div>
          )}
          {adminEdit && (
            <div className="edit-btns">
              <NavLink
                className="edit-button"
                style={{ textDecoration: "none" }}
                onClick={() => (addView ? addView(id) : "")}
                to={`/dashboard/editproduct/${id}`}
              >
                Edit
              </NavLink>
              {confirmDelete ? (
                <button
                  className="edit-button btn-confirm"
                  onClick={(): void => adminEdit(id)}
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
          {user && (
            <div className="edit-btns">
              <FontAwesomeIcon
                className="remove-cart-item"
                icon={faTrash}
                onClick={(): void => user(id)}
              />
            </div>
          )}
          {rating !== undefined && rating !== 0 && (
            <div className="rating-container">
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
