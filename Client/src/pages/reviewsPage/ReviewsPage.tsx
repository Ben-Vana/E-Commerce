import axios from "axios";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ReviewsComponent from "../../components/ReviewsComponent";
import "./reviewspage.css";
import { NavLink } from "react-router-dom";

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

const ReviewsPage = (): JSX.Element => {
  const [reviews, setReviews] = useState<productInterface>();
  const [limit, setLimit] = useState<number | null>();
  const location = useLocation();
  useEffect((): void => {
    const params = new URLSearchParams(location.search);
    const productId = params.get("pid");
    const page = params.get("p");
    axios
      .get(`/product/product/${productId}?p=${page}`)
      .then(({ data }) => {
        console.log(data);
        data.product.productReviews = data.product.productReviews.reverse();
        setReviews(data.product);
        setLimit(data.limit);
      })
      .catch((err) => console.log(err));
  }, [location]);
  const renderButtons = (): Array<JSX.Element> => {
    const param = new URLSearchParams(location.search);
    const page = param.get("p");
    const pid = param.get("pid");
    let btnArr: Array<JSX.Element> = [];
    if (page) {
      if (page === "1") {
        btnArr.push(
          <NavLink
            key="next"
            to={`/productreviews?pid=${pid}&p=${parseInt(page) + 1}`}
          >
            Next
          </NavLink>
        );
      } else if (parseInt(page) === limit) {
        btnArr.push(
          <NavLink
            key="prev"
            to={`/productreviews?pid=${pid}&p=${parseInt(page) - 1}`}
          >
            Previous
          </NavLink>
        );
      } else {
        btnArr.push(
          <NavLink
            key="prev"
            to={`/productreviews?pid=${pid}&p=${parseInt(page) - 1}`}
          >
            Previous
          </NavLink>,
          <NavLink
            key="next"
            to={`/productreviews?pid=${pid}&p=${parseInt(page) + 1}`}
          >
            Next
          </NavLink>
        );
      }
    }
    return btnArr;
  };
  return (
    <div className="reviews-container">
      {reviews &&
        reviews.productReviews.map((item, index) => (
          <ReviewsComponent
            key={item.createdAt + index}
            userId={item.userId}
            revId={item._id}
            user={item.userName}
            revBody={item.description}
            revRate={item.rating}
            admin={false}
            deleteRev={(): void => {
              return;
            }}
          />
        ))}
      {limit && <div>{renderButtons()}</div>}
    </div>
  );
};

export default ReviewsPage;
