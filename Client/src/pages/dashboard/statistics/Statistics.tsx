import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../../homePage/home.css";
import "./statistics.css";

interface item {
  _id: string;
  name: string;
  views?: number;
  rating?: number;
}

const Statistics = (): JSX.Element => {
  const [mostViewed, setMostViewed] = useState<item | null>(null);
  const [highRate, setHighRate] = useState<item | null>(null);
  const [users, setUsers] = useState<number | null>(null);
  const [err, setErr] = useState(false);

  useEffect((): void => {
    axios
      .get("/product/mostview")
      .then(({ data }) => setMostViewed(data[0]))
      .catch(() => setErr(true));
    axios
      .get("/product/highrate")
      .then(({ data }) => setHighRate(data[0]))
      .catch(() => setErr(true));
    axios
      .get("/users/userslength")
      .then(({ data }) => setUsers(data))
      .catch(() => setErr(true));
  }, []);

  return (
    <div className="stat-container">
      <div className="stat-items-container">
        <div className="stat-item">
          Most Viewed Product
          {mostViewed && (
            <div className="item-style">
              <NavLink
                className="stat-name"
                to={`/product?pid=${mostViewed._id}`}
              >
                {mostViewed.name}
              </NavLink>
              Views: {mostViewed.views}
            </div>
          )}
        </div>
        <div className="stat-item">
          Highest Rate Product
          {highRate && (
            <div className="item-style">
              <NavLink
                className="stat-name"
                to={`/product?pid=${highRate._id}`}
              >
                {highRate.name}
              </NavLink>
              Rating:{" "}
              {highRate.rating ? Math.round(highRate.rating) : highRate.rating}
            </div>
          )}
        </div>
        <div className="stat-item">
          {users && <div className="item-style">Users: {users}</div>}
        </div>
        {err && (
          <div className="server-error">
            Server Error Please Try Again Later!
          </div>
        )}
      </div>
    </div>
  );
};

export default Statistics;
