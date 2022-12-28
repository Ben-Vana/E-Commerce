import "../pages/searchPage/search.css";

interface cardProp {
  name: string;
  price: number;
  description: string;
  image: string | null;
  quantity: number;
  index: number;
}

const SearchRowCard = ({
  name,
  price,
  description,
  image,
  quantity,
  index,
}: cardProp): JSX.Element => {
  return (
    <div
      style={{
        gridRow: `${index + 1}`,
      }}
      className="row-card"
    >
      <img className="card-image" src={""} alt="pic" />
      <div
        style={{
          height: "20%",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          fontSize: "1.3rem",
          width: "80%",
        }}
      >
        <h4>{name}</h4>
        <div>{price}</div>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default SearchRowCard;
