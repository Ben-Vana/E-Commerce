import axios from "axios";
import ReviewsComponent from "../../components/ReviewsComponent";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./productPage.css";

interface productInterface {
  name: string;
  description: Array<string>;
  image: Array<string>;
  price: string;
  rating: number;
  quantity: number;
  productReviews: Array<{
    userId: string;
    userName: string;
    description: Array<string>;
    rating: number;
    createdAt: string;
    _id: string;
  }>;
}

interface reviewInterface {
  description: string;
  rating: string;
}

const ProductPage = (): JSX.Element => {
  const [product, setProduct] = useState<productInterface | null>(null);
  const [postedReview, setPostedReview] = useState({ post: false, err: "" });
  const [addReview, setAddReview] = useState<reviewInterface>({
    description: "",
    rating: "1",
  });
  const [addedRevOrCart, setAddedProp] = useState({
    cart: false,
    review: false,
  });
  const [err, setErr] = useState(false);

  const imageRef = useRef() as React.RefObject<HTMLImageElement>;

  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(
    (state: { authReducer: { login: boolean } }): boolean =>
      state.authReducer.login
  );

  useEffect((): void => {
    const qParams = new URLSearchParams(location.search);
    const productId = qParams.get("pid");
    axios
      .get(`/product/product/${productId}`)
      .then(({ data }) => {
        data.productReviews = data.productReviews.reverse();
        setProduct(data);
      })
      .catch(() => setErr(true));
  }, []);

  const handleImgSize = (): void => {
    if (imageRef.current) {
      imageRef.current.naturalHeight > imageRef.current.naturalWidth
        ? (imageRef.current.style.objectFit = "contain")
        : imageRef.current.naturalHeight > 500
        ? (imageRef.current.style.objectFit = "contain")
        : (imageRef.current.style.objectFit = "cover");
    }
  };

  const handleAddProduct = (): void => {
    if (!isLoggedIn) navigate("/login");
    const qParams = new URLSearchParams(location.search);
    const productId = qParams.get("pid");
    axios
      .post("/usercart/addproduct", { pid: productId })
      .then(() =>
        setAddedProp((state) => {
          return { cart: true, review: state.review };
        })
      )
      .catch(() => setErr(true));
  };

  const handleReviewChange = (
    ev: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ): void => {
    const tempReview = JSON.parse(JSON.stringify(addReview));
    tempReview[ev.target.id] = ev.target.value;
    setAddReview(tempReview);
  };

  const handleChangeImage = (img: string): void => {
    if (imageRef.current) {
      imageRef.current.src = `http://localhost:8181/public/images/${img}`;
    }
  };

  const handleReviewsLink = (): string => {
    const url = new URLSearchParams(location.search);
    const pid = url.get("pid");
    return `/productreviews?pid=${pid}&p=1`;
  };

  const handleReportReview = (uId: string, rId: string) => {
    axios
      .patch("/review/addreport", { uId, rId })
      .then(() => {})
      .catch(() => setErr(true));
  };

  const handleSubmitReview = (ev: React.FormEvent<HTMLFormElement>): void => {
    ev.preventDefault();
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    axios
      .get("/users/userreviewinfo")
      .then(({ data }) => {
        const dbDate =
          data.userReviews.length > 0
            ? data.userReviews[data.userReviews.length - 1].createdAt
            : 0;
        const d1 = new Date().getTime();
        const d2 = new Date(dbDate).getTime();
        if (d1 - d2 < 86400000) {
          setPostedReview({
            post: true,
            err: "You have to wait 24 hours before posting your next review.",
          });
        } else {
          const params = new URLSearchParams(location.search);
          const pid = params.get("pid");
          let tempReview = JSON.parse(JSON.stringify(addReview));
          tempReview.description = tempReview.description.split(/\n+/);
          for (let i = 0; i < tempReview.description.length; i++)
            tempReview.description[i] = tempReview.description[i].trim();
          tempReview.rating = +tempReview.rating;
          axios
            .post("/review/addreview", { productId: pid, ...tempReview })
            .then(() =>
              setAddedProp((state) => {
                return { cart: state.cart, review: true };
              })
            )
            .catch(() => setErr(true));
        }
      })
      .catch(() => setErr(true));
  };

  return (
    <div className="product-page">
      {product && !err && (
        <div className="page-content-container">
          <h3 className="product-name show-name">{product.name}</h3>
          <div className="product-gallery-container">
            <div className="product-img-container">
              <img
                ref={imageRef}
                src={`http://localhost:8181/public/images/${product.image[0]}`}
                alt={product.name}
                className="product-image"
                onLoad={handleImgSize}
                crossOrigin="anonymous"
              />
            </div>
            <div className="display-container">
              {product.image.map((item, index) => (
                <div
                  key={index}
                  className="img-display"
                  onClick={() => handleChangeImage(item)}
                >
                  <img
                    src={`http://localhost:8181/public/images/${item}`}
                    alt={product.name}
                    className="product-img"
                    crossOrigin="anonymous"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="page-content">
            <h3 className="product-name hide-name">{product.name}</h3>
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
                  {product.rating !== 0 && (
                    <div style={{ margin: "-0.5rem" }}>
                      <FontAwesomeIcon
                        icon={faStar}
                        style={
                          Math.round(product.rating) >= 1
                            ? { color: "rgb(232, 185, 35)" }
                            : { color: "var(--main-background)" }
                        }
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        style={
                          Math.round(product.rating) >= 2
                            ? { color: "rgb(232, 185, 35)" }
                            : { color: "var(--main-background)" }
                        }
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        style={
                          Math.round(product.rating) >= 3
                            ? { color: "rgb(232, 185, 35)" }
                            : { color: "var(--main-background)" }
                        }
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        style={
                          Math.round(product.rating) >= 4
                            ? { color: "rgb(232, 185, 35)" }
                            : { color: "var(--main-background)" }
                        }
                      />
                      <FontAwesomeIcon
                        icon={faStar}
                        style={
                          Math.round(product.rating) === 5
                            ? { color: "rgb(232, 185, 35)" }
                            : { color: "var(--main-background)" }
                        }
                      />
                    </div>
                  )}
                  <div>
                    {product.quantity > 0 ? "In Stock" : "Out Of Stock"}
                  </div>
                  <div>
                    <button
                      className="add-cart-btn"
                      onClick={handleAddProduct}
                      disabled={addedRevOrCart.cart}
                    >
                      {addedRevOrCart.cart ? "Added to cart" : "Add to cart"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!err ? (
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
            <button
              className="submit-review add-cart-btn"
              disabled={addedRevOrCart.review}
            >
              {addedRevOrCart.review ? "Submitted review" : "Submit review"}
            </button>
            {postedReview.err && (
              <div style={{ color: "#f00", marginTop: "0.5rem" }}>
                {postedReview.err}
              </div>
            )}
          </form>
          <div className="reviews">
            {product &&
              product.productReviews.map((item, index) => (
                <ReviewsComponent
                  key={item.createdAt + index}
                  userId={item.userId}
                  revId={item._id}
                  user={item.userName}
                  revBody={item.description}
                  revRate={item.rating}
                  report={handleReportReview}
                />
              ))}
            {product && product.productReviews[0] && (
              <NavLink to={handleReviewsLink()} className="see-reviews">
                See all reviews
              </NavLink>
            )}
          </div>
        </div>
      ) : (
        <div className="server-error">Server Error Please Try Again Later!</div>
      )}
    </div>
  );
};

export default ProductPage;
