import React, { useEffect, useState } from "react";
import Header from "./UI/Header";
import Form from "./Data/Form";
import Modal from "./Modal/Modal";
import { useDispatch } from "react-redux";
import { cartAction } from "./Redux/CartSlice";

function App() {
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    async function gettingData() {
      let respose = await fetch(
        "https://newprojectpractise-93cee-default-rtdb.firebaseio.com/cart.json"
      );
      let data = await respose.json();
      let arr = [];
      for (let key in data) {
        arr.push({
          id: key,
          ...data[key],
        });
      }
      dispatch(cartAction.get(arr));
    }
    gettingData();
  }, [dispatch]);
  const closeHandler = () => {
    setShow(false);
  };
  const showHandler = () => {
    setShow(true);
  };

  return (
    <div>
      {show && <Modal onClose={closeHandler} />}
      <Header onShow={showHandler} />
      <Form />
    </div>
  );
}

export default App;
