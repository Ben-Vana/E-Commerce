import axios from "axios";
import SearchPageCard from "../../../components/SearchPageCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../searchPage/search.css";
import "./allproducts.css";

interface cardProp {
  _id: string;
  name: string;
  price: string;
  rating: number;
  quantity: number;
  image: Array<string>;
}

const AllProducts = (): JSX.Element => {
  const [userInput, setInput] = useState("");
  const [productsArr, setProductsArr] = useState<Array<cardProp>>();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect((): void => {
    const param = new URLSearchParams(location.search);
    const query = param.get("mq");
    if (!query) {
      setProductsArr([]);
    } else {
      setInput(query);
      axios
        .get(`/product/search/${query}`)
        .then(({ data }) => setProductsArr(data))
        .catch((err) => console.log(err));
    }
  }, [location]);

  const handleKey = (ev: React.KeyboardEvent<HTMLInputElement>): void => {
    if (ev.code === "Enter") handleGetProduct();
    else return;
  };

  const handleGetProduct = () =>
    navigate(`/dashboard/manageproduct?mq=${userInput}`);

  const handleDeleteProduct = (id: string): void => {
    axios
      .delete(`/product/${id}`)
      .then(() =>
        setProductsArr((state) => {
          return state?.filter((item) => item._id !== id);
        })
      )
      .catch((err) => console.log(err));
  };

  return (
    <div className="ap-container">
      <div className="ap-search">
        <div className="ap-input-container">
          <input
            type="text"
            name="product"
            id="product"
            placeholder="Seach product"
            className="ap-input"
            value={userInput}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
              setInput(ev.target.value)
            }
            onKeyDown={handleKey}
          />
          <div className="ap-icon-container" onClick={handleGetProduct}>
            <FontAwesomeIcon
              className="ap-search-icon"
              icon={faMagnifyingGlass}
            />
          </div>
        </div>
      </div>
      <div className="search-page-container ap-res">
        {productsArr &&
          productsArr.map((item: cardProp, index) => (
            <SearchPageCard
              key={item.name + index}
              id={item._id}
              name={item.name}
              price={item.price}
              rating={item.rating}
              image={item.image[0]}
              quantity={item.quantity}
              adminEdit={handleDeleteProduct}
            />
          ))}
      </div>
    </div>
  );
};

export default AllProducts;
