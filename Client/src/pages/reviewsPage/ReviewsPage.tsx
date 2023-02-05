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
      if (page === "1" && parseInt(page) !== limit) {
        btnArr.push(
          <div key="none"></div>,
          <NavLink
            key="next"
            className="rev-btn"
            to={`/productreviews?pid=${pid}&p=${parseInt(page) + 1}`}
          >
            Next
          </NavLink>
        );
      } else if (parseInt(page) === limit && parseInt(page) !== 1) {
        btnArr.push(
          <NavLink
            key="prev"
            className="rev-btn"
            to={`/productreviews?pid=${pid}&p=${parseInt(page) - 1}`}
          >
            Previous
          </NavLink>
        );
      } else if (parseInt(page) !== limit) {
        btnArr.push(
          <NavLink
            key="prev"
            className="rev-btn"
            to={`/productreviews?pid=${pid}&p=${parseInt(page) - 1}`}
          >
            Previous
          </NavLink>,
          <NavLink
            key="next"
            className="rev-btn"
            to={`/productreviews?pid=${pid}&p=${parseInt(page) + 1}`}
          >
            Next
          </NavLink>
        );
      }
    }
    return btnArr;
  };

  const handleReportReview = (uId: string, rId: string) => {
    axios
      .post("/review/addreport", { uId, rId })
      .then(() => {})
      .catch((err) => console.log(err));
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
            report={handleReportReview}
          />
        ))}
      {limit !== 0 && (
        <div className="rev-btns-container">{renderButtons()}</div>
      )}
    </div>
  );
};

export default ReviewsPage;
