import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../pages/searchPage/search.css";

interface cardProp {
  id: string;
  name: string;
  price: string;
  image: string;
  admin: { admin: boolean; delFunc: Function };
}

const SearchPageCard = ({
  id,
  name,
  price,
  image,
  admin,
}: cardProp): JSX.Element => {
  const [confirmDelete, setDelete] = useState(false);
  const navigate = useNavigate();
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
              <button
                className="edit-button"
                onClick={(): void => navigate(`/dashboard/editproduct/${id}`)}
              >
                Edit
              </button>
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
        </div>
      </div>
    </div>
  );
};

export default SearchPageCard;
