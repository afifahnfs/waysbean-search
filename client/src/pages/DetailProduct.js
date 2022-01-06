import { Card, Col, Container, Image } from "react-bootstrap";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { API } from "../config/api";

import { OrderContext } from "../context/orderContext";

import cssDP from "../pages/styleModule/DetailProduct.module.css";
import NavbarUser from "../components/NavbarUser";
import convertRupiah from "rupiah-format";

export default function DetailProduct() {
  const { id } = useParams();

  const [product, setProduct] = useState([]);

  const getProduct = async (id) => {
    try {
      const response = await API.get("/product/" + id);
      // Store product data to useState variabel
      setProduct(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct(id);
  }, []);

  const { orderMenus, setOrderMenus } = useContext(OrderContext);

  let clickOrder = (item) => {
    console.log(item);
    console.log(orderMenus);

    const currentCarts = orderMenus.carts;
    console.log(currentCarts);

    let currentSubTotal = orderMenus.subtotal;

    const isAlreadyExist = currentCarts.some(
      (element) => element.item.id === item.id
    );
    if (!isAlreadyExist) {
      currentCarts.push({ item: item, qty: 1 });
      setOrderMenus({
        carts: currentCarts,
        subtotal: currentSubTotal + 1,
      });

      console.log(orderMenus);
      return;
    }
    currentCarts.map((element) => {
      if (element.item.id === item.id) {
        element.qty += 1;
        currentSubTotal += 1;
      }
      return element;
    });

    setOrderMenus({ carts: currentCarts, subtotal: currentSubTotal });

    console.log(orderMenus);
  };

  return (
    <div>
      <NavbarUser />
      <Container>
        <div className={cssDP.main}>
          <div>
            <Image className={cssDP.photo} src={product.photo} />
          </div>
          <div>
            <h1 className={cssDP.title}>{product.name}</h1>
            <p className={cssDP.stock}>Stock: {product.stock}</p>
            <p className={cssDP.desc}>{product.description}</p>
            <p className={cssDP.price}>
              {convertRupiah.convert(product.price)}
            </p>
            <button className={cssDP.btn} onClick={() => clickOrder(product)}>
              Add Cart
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
