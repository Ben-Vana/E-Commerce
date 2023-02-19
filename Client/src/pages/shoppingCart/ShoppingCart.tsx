import axios from "axios";
import { useEffect, useState } from "react";
import SearchPageCard from "../../components/SearchPageCard";
import "./shoppingcart.css";

interface cartItems {
  _id: string;
  image: Array<string>;
  name: string;
  price: string;
  quantity: number;
}

const ShoppingCart = (): JSX.Element => {
  const [cart, setCart] = useState<cartItems[]>();

  useEffect((): void => {
    axios
      .get("/usercart/getcart")
      .then(({ data }) => {
        const arr: any = [];
        const cartLength = data.shoppingCart.length;
        for (let i = 0; i < cartLength; i++) {
          axios
            .get(`/product/product/${data.shoppingCart[i]}`)
            .then(({ data }) => {
              arr.push(data);
              if (i === cartLength - 1) setCart(arr);
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleRemoveProduct = (id: string): void => {
    console.log(id);
  };

  return (
    <div className="cartpage-container">
      {cart
        ? cart?.map((item, index) => (
            <SearchPageCard
              key={item.name + index}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image[0]}
              quantity={item.quantity}
              user={handleRemoveProduct}
            />
          ))
        : ""}
      <button onClick={() => console.log(cart)}>click</button>
    </div>
  );
};

export default ShoppingCart;
