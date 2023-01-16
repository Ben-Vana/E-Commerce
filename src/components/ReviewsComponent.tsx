interface reviewInterface {
  id: string;
  user: string;
  revBody: string;
  revRate: number;
}

const ReviewsComponent = ({
  id,
  user,
  revBody,
  revRate,
}: reviewInterface): JSX.Element => {
  return (
    <div className="review-comp-wrapper">
      <h4>{user}</h4>
      <div>{revBody}</div>
    </div>
  );
};

export default ReviewsComponent;
