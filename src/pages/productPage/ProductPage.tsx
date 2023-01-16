import axios from "axios";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ReviewsComponent from "../../components/ReviewsComponent";
import "./productPage.css";

interface productInterface {
  name: string;
  description: Array<string>;
  image: string;
  price: string;
  quantity: number;
  reviews: Array<{
    userId: string;
    userName: string;
    description: string;
    rating: number;
    createdAt: string;
  }>;
}

interface reviewInterface {
  description: string;
  rating: string;
}

const ProductPage = (): JSX.Element => {
  const [product, setProduct] = useState<productInterface | null>(null);
  const [addReview, setAddReview] = useState<reviewInterface>({
    description: "",
    rating: "1",
  });
  const location = useLocation();

  useEffect((): void => {
    const qParams = new URLSearchParams(location.search);
    const productId = qParams.get("pid");
    axios
      .get(`/product/product/${productId}`)
      .then(({ data }) => setProduct(data))
      .catch((error) => console.log(error));
  }, []);

  const handleAddProduct = () => {
    const qParams = new URLSearchParams(location.search);
    const productId = qParams.get("pid");
    axios.post("/usercart/addproduct", { pid: productId });
  };

  const handleReviewChange = (
    ev: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const tempReview = JSON.parse(JSON.stringify(addReview));
    tempReview[ev.target.id] = ev.target.value;
    setAddReview(tempReview);
  };

  const handleSubmitReview = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const params = new URLSearchParams(location.search);
    const pid = params.get("pid");
    let tempReview = JSON.parse(JSON.stringify(addReview));
    tempReview.description = tempReview.description.split(/\n+/);
    for (let i = 0; i < tempReview.description.length; i++)
      tempReview.description[i] = tempReview.description[i].trim();
    tempReview.rating = +tempReview.rating;
    axios
      .post("/product/addreview", { productId: pid, ...tempReview })
      .then(() => console.log("Yosh"))
      .catch((err) => console.log(err));
  };

  return (
    <div className="product-page">
      {product ? (
        <div className="page-content-container">
          <div className="product-image-container">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
          </div>
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
                    <button className="add-cart-btn" onClick={handleAddProduct}>
                      Add to cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="review-container">
        <form className="user-review" onSubmit={handleSubmitReview}>
          <label className="review-label" htmlFor="description">
            Write your review:
          </label>
          <textarea
            className="review-input"
            name="description"
            id="description"
            value={addReview.description}
            onChange={handleReviewChange}
            required
          />
          <div className="rating-container">
            <label className="rating-label" htmlFor="rating">
              Rating:
            </label>
            <select
              className="rating-select"
              name="rating"
              id="rating"
              onChange={handleReviewChange}
            >
              <option className="rating-option" value="1">
                1
              </option>
              <option className="rating-option" value="2">
                2
              </option>
              <option className="rating-option" value="3">
                3
              </option>
              <option className="rating-option" value="4">
                4
              </option>
              <option className="rating-option" value="5">
                5
              </option>
            </select>
          </div>
          <button className="submit-review add-cart-btn">Submit review</button>
        </form>
        <div className="reviews">
          {product &&
            product.reviews.map((item, index) => (
              <ReviewsComponent
                key={item.createdAt + index}
                id={item.userId}
                user={item.userName}
                revBody={item.description}
                revRate={item.rating}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
