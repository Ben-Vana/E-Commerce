import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./productPage.css";

interface productInterface {
  name: string;
  description: string;
  image: string;
  price: string;
  quantity: number;
}

const ProductPage = (): JSX.Element => {
  const [product, setProduct] = useState<productInterface | null>(null);
  const location = useLocation();

  useEffect((): void => {
    const qParams = new URLSearchParams(location.search);
    const productId = qParams.get("pid");
    axios
      .get(`/product/product/${productId}`)
      .then(({ data }) => setProduct(data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <div>
      {product ? (
        <div className="page-content-container">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
          <div className="page-content">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-description">{product.description}</p>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ProductPage;
