import axios from "axios";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ReviewsComponent from "../../components/ReviewsComponent";

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
  const location = useLocation();
  useEffect((): void => {
    const params = new URLSearchParams(location.search);
    const productId = params.get("pid");
    const page = params.get("p");
    axios
      .get(`/product/product/${productId}?p=${page}`)
      .then(({ data }) => {
        data.productReviews = data.productReviews.reverse();
        setReviews(data);
      })
      .catch((err) => console.log(err));
  }, []);
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
    </div>
  );
};

export default ReviewsPage;
