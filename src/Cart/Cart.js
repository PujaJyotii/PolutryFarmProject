import { useDispatch, useSelector } from "react-redux";
import Card from "../UI/Card";
import classes from "./Cart.module.css";
import { cartAction } from "../Redux/CartSlice";

function Cart(props) {
  let arr = useSelector((state) => state.cart.cartList);
  const dispact = useDispatch();
  let totalAmount = arr.reduce((total, acc) => {
    return total + acc.amount * acc.price;
  }, 0);

  const reduceHandler = async (item) => {
    let existingItem = arr.find((items) => items.nameV === item.nameV);
    try {
      let resp = await fetch(
        `https://newprojectpractise-93cee-default-rtdb.firebaseio.com/cart/${existingItem.id}.json`,
        {
          method: "PUT",
          body: JSON.stringify({
            ...existingItem,
            amount: existingItem.amount - 1,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!resp.ok) {
        throw new Error(resp.status);
      }
      let data = await resp.json();
      console.log(data);
      dispact(cartAction.reduce(item));
    } catch (error) {
      console.log(error);
    }
  };

  const increaseHandler = async (item) => {
    let existingItem = arr.find((items) => items.nameV === item.nameV);
    try {
      let resp = await fetch(
        `https://newprojectpractise-93cee-default-rtdb.firebaseio.com/cart/${existingItem.id}.json`,
        {
          method: "PUT",
          body: JSON.stringify({
            ...existingItem,
            amount: existingItem.amount + 1,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!resp.ok) {
        throw new Error(resp.status);
      }
      let data = await resp.json();
      console.log(data);
      dispact(cartAction.add({ ...item, amount: 1 }));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Card className={classes.cart}>
      <h4>Cart Data</h4>
      <ul>
        {arr.map((item) => (
          <li key={item.nameV}>
            <div>
              <div>Name of group: {item.nameV}</div>
              <div>Species: {item.species}</div>
              <div>Price per egg: Rs.{item.price}</div>
            </div>
            <div className={classes.box}>
              <span
                className={classes.increase}
                onClick={() => increaseHandler(item)}
              >
                +
              </span>
              <span>x{item.amount}</span>
              <span
                className={classes.increase}
                onClick={() => reduceHandler(item)}
              >
                -
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className={classes.total}>Total Amount :Rs{totalAmount}</div>
      <div className={classes.btn}>
        <button>Purchase</button>
        <button onClick={props.onClose}>Close</button>
      </div>
    </Card>
  );
}

export default Cart;
