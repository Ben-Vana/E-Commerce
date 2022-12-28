import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./search.css";
import SearchRowCard from "../../components/SearchRowCard";

const SearchPage = (): JSX.Element => {
  const [productsArr, setProductsArr] = useState<Array<object>>([]);
  const location = useLocation();

  interface cardProp {
    name: string;
    price: number;
    description: string;
    image: string | null;
    quantity: number;
  }

  useEffect(() => {
    const qParams = new URLSearchParams(location.search);
    const search = qParams.get("s");
    axios
      .get(`/product/${search}`)
      .then(({ data }) => setProductsArr(data))
      .catch((err) => console.log(err));
  }, [location]);
  return (
    <div style={{}}>
      <h3>Your search result</h3>
      <div className="search-page-container">
        <div
          className="result-container"
          style={
            productsArr.length < 20
              ? { gridTemplateRows: `repeat(${productsArr.length}, 13rem)` }
              : { gridTemplateRows: "repeat(20, 13rem)" }
          }
        >
          {productsArr[0]
            ? productsArr.map((item: cardProp, index) => (
                <SearchRowCard
                  key={item.name + index}
                  name={item.name}
                  price={item.price}
                  description={item.description}
                  image={item.image}
                  quantity={item.quantity}
                  index={index}
                />
              ))
            : ""}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
