import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const SearchPage = (): JSX.Element => {
  const [productsArr, setProductsArr] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const qParams = new URLSearchParams(location.search);
    const search = qParams.get("s");
    axios
      .get(`/product/${search}`)
      .then(({ data }) => setProductsArr(data))
      .catch((err) => console.log(err));
  }, [location]);
  return <></>;
};

export default SearchPage;
