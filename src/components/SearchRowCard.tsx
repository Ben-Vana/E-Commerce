import "../pages/searchPage/search.css";

interface cardProp {
  name: string;
  price: number;
  image: string;
}

const SearchRowCard = ({
  name,
  price,

  image,
}: cardProp): JSX.Element => {
  return (
    <div className="row-card">
      <div className="image-container">
        <img className="card-image" src={image} alt={name} />
      </div>
      <div className="card-content">
        <h4 className="card-header" title={name}>
          {name}
        </h4>
        <div className="card-price">{price}$</div>
      </div>
    </div>
  );
};

export default SearchRowCard;
