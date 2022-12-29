import "../pages/searchPage/search.css";

interface cardProp {
  name: string;
  price: number;
  description: string;
  image: string;
  quantity: number;
}

const SearchRowCard = ({
  name,
  price,
  description,
  image,
  quantity,
}: cardProp): JSX.Element => {
  return (
    <div className="row-card">
      <h4 className="card-header" title={name}>
        {name}
      </h4>
      <div className="image-container">
        <img className="card-image" src={image} alt={name} />
      </div>
      <div className="card-content">
        <p>{description}</p>
      </div>
      <div className="card-footer">
        <div>{price}$</div>
      </div>
    </div>
  );
};

export default SearchRowCard;
