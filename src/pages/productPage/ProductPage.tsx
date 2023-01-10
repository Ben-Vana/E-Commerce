import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./productPage.css";

interface productInterface {
  name: string;
  description: Array<string>;
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
    <div className="product-page">
      {product ? (
        <div className="page-content-container">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
          <div className="page-content">
            <h3 className="product-name">{product.name}</h3>
            <div className="content-wrapper">
              <div className="desc-container">
                {product.description.map((item, index) => (
                  <p key={item + index} className="product-description">
                    {item}
                  </p>
                ))}
              </div>
              <div className="product-checkout">
                <div className="checkout-content">
                  <div>{product.price}$</div>
                  <div>
                    {product.quantity > 0 ? "In Stock" : "Out Of Stock"}.
                  </div>
                  <div>
                    <button>Add to cart</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ProductPage;
