import { useEffect, useState } from "react";
import Card from "../UI/Card";
import classes from "./Form.module.css";
import { useDispatch, useSelector } from "react-redux";
import { formAction } from "../Redux/FormSlice";
import { cartAction } from "../Redux/CartSlice";

function Form() {
  const [nameV, setNameV] = useState("");
  const [species, setSpecies] = useState("");
  const [eggs, setEgg] = useState("");
  const [price, setPrice] = useState("");
  let FormList = useSelector((state) => state.form.list);
  let CartList = useSelector((state) => state.cart.cartList);

  let dispatch = useDispatch();
  const SubmitHandler = async (e) => {
    e.preventDefault();
    if (
      nameV.length === 0 ||
      species.length === 0 ||
      +eggs <= 0 ||
      +price <= 0
    ) {
      return;
    }
    let obj = {
      nameV: nameV,
      species: species,
      eggs: eggs,
      price: price,
    };
    try {
      let resp = await fetch(
        "https://newprojectpractise-93cee-default-rtdb.firebaseio.com/data.json",
        {
          method: "POST",
          body: JSON.stringify(obj),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!resp.ok) {
        throw new Error(resp.status);
      }
      let data = await resp.json();
      let out = { ...obj, id: data.name };
      dispatch(formAction.add(out));
    } catch (err) {
      console.log(err);
    }

    setNameV("");
    setSpecies("");
    setEgg("");
    setPrice("");
  };
  useEffect(() => {
    async function getData() {
      let res = await fetch(
        "https://newprojectpractise-93cee-default-rtdb.firebaseio.com/data.json"
      );
      let data = await res.json();
      let arr = [];
      for (let key in data) {
        arr.push({
          id: key,
          ...data[key],
        });
      }
      dispatch(formAction.get(arr));
    }

    getData();
  }, [dispatch]);

  const deleteHandler = async (nameV) => {
    let index = FormList.findIndex((item) => item.nameV === nameV);
    try {
      let resp = await fetch(
        `https://newprojectpractise-93cee-default-rtdb.firebaseio.com/data/${FormList[index].id}.json`,
        {
          method: "DELETE",
        }
      );
      if (!resp.ok) {
        throw new Error(resp.status);
      }
      let data = await resp.json();
      console.log(data);
      dispatch(formAction.delete(nameV));
    } catch (error) {
      console.log(error);
    }
  };
  const editHandler = async (item) => {
    setNameV(item.nameV);
    setSpecies(item.species);
    setEgg(item.eggs);
    setPrice(item.price);
    let index = FormList.findIndex((items) => items.nameV === item.nameV);
    try {
      let resp = await fetch(
        `https://newprojectpractise-93cee-default-rtdb.firebaseio.com/data/${FormList[index].id}.json`,
        {
          method: "DELETE",
        }
      );
      if (!resp.ok) {
        throw new Error(resp.status);
      }
      let data = await resp.json();
      console.log(data);
      dispatch(formAction.delete(item.nameV));
    } catch (error) {
      console.log(error);
    }
  };
  const updateHandler = async (item) => {
    let index = FormList.findIndex((items) => items.nameV === item.nameV);
    if (
      nameV.length === 0 ||
      species.length === 0 ||
      +eggs <= 0 ||
      +price <= 0
    ) {
      return;
    }
    let res = {
      nameV: nameV,
      species: species,
      id: item.id,
      eggs: eggs,
      price: price,
    };
    try {
      let resp = await fetch(
        `https://newprojectpractise-93cee-default-rtdb.firebaseio.com/data/${FormList[index].id}.json`,
        {
          method: "PUT",
          body: JSON.stringify(res),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!resp.json) {
        throw new Error(resp.status());
      }
      let data = await resp.json();
      console.log(data);
      dispatch(formAction.update(res));
    } catch (err) {
      console.log(err);
    }
    setNameV("");
    setPrice("");
    setEgg("");
    setSpecies("");
  };
  const addHandler = async (item, amount) => {
    let index = FormList.findIndex((items) => items.id === item.id);

    let val = {
      id: item.id,
      nameV: item.nameV,
      species: item.species,
      price: item.price,
      eggs: item.eggs - amount,
    };

    try {
      let resp = await fetch(
        `https://newprojectpractise-93cee-default-rtdb.firebaseio.com/data/${FormList[index].id}.json`,
        {
          method: "PUT",
          body: JSON.stringify(val),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!resp.json) {
        throw new Error(resp.status());
      }

      dispatch(formAction.update(val));
      let Index = CartList.findIndex((items) => items.nameV === item.nameV);
      console.log(Index);
      if (Index === -1) {
        let resp = await fetch(
          "https://newprojectpractise-93cee-default-rtdb.firebaseio.com/cart.json",
          {
            method: "POST",
            body: JSON.stringify({ ...item, amount: amount }),
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!resp.ok) {
          throw new Error(resp.status);
        }
        let data = await resp.json();
        console.log(data);
        dispatch(cartAction.add({ ...item, amount: amount, id: data.name }));
      } else {
        let obj = {
          ...CartList[Index],
          amount: CartList[Index].amount + amount,
        };
        let resp = await fetch(
          `https://newprojectpractise-93cee-default-rtdb.firebaseio.com/cart/${CartList[Index].id}.json`,
          {
            method: "PUT",
            body: JSON.stringify(obj),
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!resp.ok) {
          throw new Error(resp.status);
        }
        let data = await resp.json();
        console.log(data);
        dispatch(cartAction.add(obj));
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Card className={classes.form}>
        <h4>Data Collecting Form</h4>
        <form onSubmit={SubmitHandler}>
          <label>Bird Group Name:</label>
          <input
            type="text"
            value={nameV}
            onChange={(e) => setNameV(e.target.value)}
          />
          <label>Species:</label>
          <input
            type="text"
            value={species}
            onChange={(e) => setSpecies(e.target.value)}
          />
          <label>No of Eggs:</label>
          <input
            type="number"
            value={eggs}
            onChange={(e) => setEgg(e.target.value)}
          />
          <label>Price per egg:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button>Add Item</button>
        </form>
      </Card>
      <Card className={classes.list}>
        <ul>
          {FormList.map((item) => (
            <li key={item.nameV}>
              <div className={classes.seperation}>
                <div className={classes.data}>
                  {item.nameV} - {item.species} - {item.eggs} - Price:Rs
                  {item.price}
                </div>
                <div>
                  <button onClick={() => updateHandler(item)}>Update</button>
                  <button onClick={() => editHandler(item)}>Edit</button>
                  <button onClick={() => deleteHandler(item.nameV)}>
                    Delete
                  </button>
                </div>
              </div>
              <div className={classes.btned}>
                {item.eggs >= 2 && (
                  <button onClick={() => addHandler(item, 2)}>
                    Add to Cart x2
                  </button>
                )}
                {item.eggs >= 3 && (
                  <button onClick={() => addHandler(item, 3)}>
                    Add to Cart x3
                  </button>
                )}
                {item.eggs >= 1 && (
                  <button onClick={() => addHandler(item, 1)}>
                    Add to Cart x1
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}

export default Form;
