import "../pages/searchPage/search.css";

interface cardProp {
  id: string;
  name: string;
  price: number;
  image: string;
  click: Function;
}

const SearchRowCard = ({
  id,
  name,
  price,
  image,
  click,
}: cardProp): JSX.Element => {
  return (
    <div className="row-card">
      <div className="image-container">
        <img
          className="card-image"
          src={image}
          alt={name}
          onClick={() => click(id)}
        />
      </div>
      <div className="card-content">
        <h4 className="card-header" title={name} onClick={() => click(id)}>
          {name}
        </h4>
        <div className="card-price">{price}$</div>
      </div>
    </div>
  );
};

export default SearchRowCard;
