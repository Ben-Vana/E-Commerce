import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./search.css";
import SearchRowCard from "../../components/SearchRowCard";

const SearchPage = (): JSX.Element => {
  const [productsArr, setProductsArr] = useState<Array<object>>([]);
  const [userSearch, setUserSearch] = useState<string | null>("");
  const location = useLocation();

  interface cardProp {
    name: string;
    price: number;
    description: string;
    image: string;
    quantity: number;
  }

  useEffect(() => {
    const qParams = new URLSearchParams(location.search);
    const search = qParams.get("s");
    setUserSearch(search);
    axios
      .get(`/product/${search}`)
      .then(({ data }) => setProductsArr(data))
      .catch((err) => console.log(err));
  }, [location]);

  return (
    <div style={{}}>
      <h3 className="search-result">Search result for "{userSearch}"</h3>
      <div className="search-page-container">
        {productsArr[0]
          ? productsArr.map((item: cardProp, index) => (
              <SearchRowCard
                key={item.name + index}
                name={item.name}
                price={item.price}
                description={item.description}
                image={item.image}
                quantity={item.quantity}
              />
            ))
          : ""}
      </div>
    </div>
  );
};

export default SearchPage;
