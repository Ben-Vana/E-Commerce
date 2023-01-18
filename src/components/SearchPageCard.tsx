import { NavLink, useNavigate } from "react-router-dom";
import "../pages/searchPage/search.css";

interface cardProp {
  id: string;
  name: string;
  price: number;
  image: string;
  admin: boolean;
}

const SearchPageCard = ({
  id,
  name,
  price,
  image,
  admin,
}: cardProp): JSX.Element => {
  const navigate = useNavigate();
  return (
    <div className="row-card">
      <div className="image-container">
        <NavLink to={`/product?pid=${id}`}>
          <img className="card-image" src={image} alt={name} />
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
          {admin && (
            <button
              className="edit-button"
              onClick={(): void => navigate(`/dashboard/editproduct/${id}`)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPageCard;
