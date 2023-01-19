import axios from "axios";
import ReviewsComponent from "../../components/ReviewsComponent";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./productPage.css";

interface productInterface {
  name: string;
  description: Array<string>;
  image: Array<string>;
  price: string;
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

  const imageRef = useRef() as React.RefObject<HTMLImageElement>;

  const location = useLocation();
  const navigate = useNavigate();
  const isLoggedIn = useSelector(
    (state: { authReducer: { login: boolean } }): boolean =>
      state.authReducer.login
  );
  const isAdmin = useSelector(
    (state: { authReducer: { userData: { admin: boolean } } }) =>
      state.authReducer.userData.admin
  );

  useEffect((): void => {
    const qParams = new URLSearchParams(location.search);
    const productId = qParams.get("pid");
    axios
      .get(`/product/product/${productId}`)
      .then(({ data }) => setProduct(data))
      .catch((error) => console.log(error));
  }, []);

  const handleImgSize = () => {
    if (imageRef.current) {
      imageRef.current.naturalHeight > imageRef.current.naturalWidth
        ? (imageRef.current.style.objectFit = "contain")
        : (imageRef.current.style.objectFit = "fill");
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
      .catch((err) => console.log(err));
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
      imageRef.current.src = img;
    }
  };

  const handleDeleteReview = (id: string): void => {
    const qParams = new URLSearchParams(location.search);
    const productId = qParams.get("pid");
    axios
      .post("/product/revtoken", { pid: productId, rid: id })
      .then(({ data }) => {
        axios
          .delete(`/product/deletereview/${data}`)
          .then(({ data }) => {
            const tempProduct = JSON.parse(JSON.stringify(product));
            tempProduct.productReviews = data.productReviews;
            setProduct(tempProduct);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
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
        const dbDate = data.userReviews[data.userReviews.length - 1].createdAt;
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
            .post("/product/addreview", { productId: pid, ...tempReview })
            .then(() =>
              setAddedProp((state) => {
                return { cart: state.cart, review: true };
              })
            )
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="product-page">
      {product ? (
        <div className="page-content-container">
          <h3 className="product-name show-name">{product.name}</h3>
          <div className="product-gallery-container">
            <div className="product-img-container">
              <img
                ref={imageRef}
                src={product.image[0]}
                alt={product.name}
                className="product-image"
                onLoad={handleImgSize}
              />
            </div>
            <div className="display-container">
              {product.image.map((item, index) => (
                <div
                  key={index}
                  className="img-display"
                  onClick={() => handleChangeImage(item)}
                >
                  <img src={item} alt={product.name} className="product-img" />
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
                admin={isAdmin}
                deleteRev={handleDeleteReview}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
