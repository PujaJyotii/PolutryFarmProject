import { useSelector } from "react-redux";
import classes from "./Header.module.css";

function Header(props) {
  let arr = useSelector((state) => state.cart.cartList);
  let totalQuantity = arr.reduce((total, acc) => {
    return total + acc.amount;
  }, 0);
  return (
    <div className={classes.header}>
      <h3>Happy Hen Haven</h3>
      <button className={classes.btn} onClick={props.onShow}>
        <div>Cart</div>
        <div className={classes.value}>({totalQuantity})</div>
      </button>
    </div>
  );
}

export default Header;
