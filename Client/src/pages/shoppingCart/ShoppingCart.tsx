import axios from "axios";
import { useEffect, useState } from "react";
import SearchPageCard from "../../components/SearchPageCard";
import "./shoppingcart.css";
import "../productPage/productPage.css";

interface cartItems {
  _id: string;
  image: Array<string>;
  name: string;
  price: string;
  quantity: number;
}

const ShoppingCart = (): JSX.Element => {
  const [cart, setCart] = useState<cartItems[]>([]);
  const [price, setPrice] = useState(0);

  useEffect((): void => {
    axios
      .get("/usercart/getcart")
      .then(({ data }) => {
        const cartLength = data.shoppingCart.length;
        for (let i = 0; i < cartLength; i++) {
          if (i === 0) {
            setCart([]);
            setPrice(0);
          }
          axios
            .get(`/product/product/${data.shoppingCart[i]}`)
            .then(({ data }) => {
              setCart((state: cartItems[]): cartItems[] => {
                if (state) {
                  const tempCart = JSON.parse(JSON.stringify(state));
                  tempCart.push(data);
                  return tempCart;
                } else return [data];
              });
              setPrice((state) => state + parseInt(data.price));
            })
            .catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleRemoveProduct = (id: string): void => {
    axios
      .patch("/usercart/editcart", { pid: id })
      .then(() => {
        let tempCart = JSON.parse(JSON.stringify(cart));
        tempCart = tempCart.filter((item: cartItems) => item._id !== id);
        setCart(tempCart);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="cartpage-container">
      {cart ? (
        <div className="cart-items-container">
          {cart.map((item, index) => (
            <SearchPageCard
              key={item.name + index}
              id={item._id}
              name={item.name}
              price={item.price}
              image={item.image[0]}
              quantity={item.quantity}
              user={handleRemoveProduct}
            />
          ))}
        </div>
      ) : (
        ""
      )}
      <div className="cart-price-wrapper">
        <div className="cart-price">{price}$</div>
      </div>
    </div>
  );
};

export default ShoppingCart;
