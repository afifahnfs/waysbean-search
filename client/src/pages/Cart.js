import {
  Container,
  Form,
  Row,
  Col,
  Image,
  Modal,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router";
import { useState, useContext } from "react";
import { OrderContext } from "../context/orderContext";
import { Link } from "react-router-dom";
import { API } from "../config/api";

import convertRupiah from "rupiah-format";
import cssCart from "./styleModule/Cart.module.css";
import NavbarUser from "../components/NavbarUser";

import imgEmpty from "../images/undraw_clean_up_ucm0.svg";
import trash from "../images/trash.png";

export default function Cart() {
  const [message, setMessage] = useState(null);

  const { orderMenus, setOrderMenus } = useContext(OrderContext);

  const order = orderMenus.carts;

  console.log(order);

  const multiple = order.map((elm) => {
    return elm.item.price * elm.qty;
  });

  const sum =
    multiple.length === 0
      ? 0
      : multiple.reduce((a, b) => {
          return a + b;
        });

  const total = sum;

  const onClickIncrement = (e, item) => {
    e.preventDefault();

    console.log("test");
    let currentCarts = orderMenus.carts;
    let currentSubTotal = orderMenus.subtotal;
    currentCarts.map((element) => {
      if (element.item.id === item.id) {
        element.qty += 1;
        currentSubTotal += 1;
      }
      return element;
    });
    setOrderMenus({ carts: currentCarts, subtotal: currentSubTotal });
  };

  const onClickDecrement = (e, item) => {
    e.preventDefault();

    let currentCarts = orderMenus.carts;
    let currentSubTotal = orderMenus.subtotal;
    currentCarts.map((element) => {
      if (element.item.id === item.id) {
        element.qty -= 1;
        currentSubTotal -= 1;
      }
      return element;
    });
    setOrderMenus({ carts: currentCarts, subtotal: currentSubTotal });
  };

  const onClickTrash = (e, item) => {
    e.preventDefault();

    let currentCarts = orderMenus.carts;
    let currentSubTotal = orderMenus.subtotal;
    currentCarts = currentCarts.filter((element) => {
      if (element.item.id === item.id) {
        currentSubTotal -= element.qty;
      }
      return element.item.id !== item.id;
    });

    setOrderMenus({ carts: currentCarts, subtotal: currentSubTotal });
  };

  // const handleSubmit = async (e) => {
  //   try {
  //     e.preventDefault();

  //     // get id and qty
  //     let currentCarts = orderMenus.carts;
  //     let dataTransaction = currentCarts.map((element) => {
  //       return {
  //         id: element.item.id,
  //         qty: element.qty,
  //       };
  //     });

  //     let product = {
  //       products: dataTransaction,
  //     };

  //     console.log(product);

  //     const config = {
  //       headers: {
  //         "Content-type": "application/json",
  //       },
  //     };
  //     // Insert transaction data
  //     const response = await API.post("/transaction", product, config);

  //     const alert = (
  //       <Alert variant="success" className="py-1">
  //         Transaction success
  //       </Alert>
  //     );
  //     setMessage(alert);

  //     console.log(response);
  //   } catch (error) {
  //     const alert = (
  //       <Alert variant="danger" className="py-1">
  //         Transaction Failed
  //       </Alert>
  //     );
  //     setMessage(alert);

  //     console.log(error);
  //   }
  // };

  return (
    <>
      <NavbarUser />
      <div className={cssCart.main}>
        <Container>
          {message && message}
          {order.length !== 0 ? (
            <div className={cssCart.wrap}>
              <h1 className={cssCart.mainTitle}>My Cart</h1>
              <p className={cssCart.text}>Review Your Order</p>
              <form>
                <Row>
                  <Col xs={7}>
                    <div className={cssCart.border}></div>

                    {order?.map((element, index) => (
                      <div className={cssCart.card} key={index}>
                        <div className={cssCart.cardOrder}>
                          <div>
                            <Image
                              className={cssCart.img}
                              src={element.item.photo}
                            ></Image>
                          </div>

                          <div className={cssCart.pesan}>
                            <p className={cssCart.cookName}>
                              {element.item.name}
                            </p>

                            <button
                              className={cssCart.btnPlusMin}
                              onClick={(e) => onClickDecrement(e, element.item)}
                            >
                              -
                            </button>

                            <input
                              className={cssCart.qty}
                              type="text"
                              value={element.qty}
                              name="qty"
                            />

                            <button
                              className={cssCart.btnPlusMin}
                              onClick={(e) => onClickIncrement(e, element.item)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className={cssCart.cardPrice}>
                          <p className={cssCart.textCard}>
                            {convertRupiah.convert(element.item.price)}
                          </p>
                          <button
                            className={cssCart.btnTrash}
                            onClick={(e) => onClickTrash(e, element.item)}
                          >
                            <Image src={trash}></Image>
                          </button>
                        </div>
                      </div>
                    ))}
                  </Col>

                  <Col>
                    <div className={cssCart.border}></div>
                    <div className={`${cssCart.cardRight} pt-2`}>
                      <div className={cssCart.subtotal}>
                        <p className={cssCart.textCard}>Subtotal</p>
                        <p className={cssCart.textCard}>Qty</p>
                      </div>
                      <div className={cssCart.priceSubtotal}>
                        <p className={cssCart.textCard}>
                          {convertRupiah.convert(sum)}
                        </p>
                        <p className={cssCart.textCard}>
                          {orderMenus.subtotal}
                        </p>
                      </div>
                    </div>

                    <div className={cssCart.cardTotal}>
                      <div>
                        <p className={cssCart.total}>Total</p>
                      </div>
                      <div>
                        <p className={`${cssCart.total} text-end`}>
                          {convertRupiah.convert(total)}
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>

                <div className={cssCart.btnWrap}>
                  <Link to={`/shipping`} style={{ textDecoration: "none" }}>
                    <button className={cssCart.btnOrder} type="submit">
                      Proceed To Checkout
                    </button>
                  </Link>
                </div>
              </form>
            </div>
          ) : (
            <Col>
              <div className="text-center pt-5">
                <img
                  src={imgEmpty}
                  className="img-fluid"
                  style={{ width: "100%" }}
                  alt="empty"
                />
                <div className="mt-3">No data product</div>
              </div>
            </Col>
          )}
        </Container>
      </div>
    </>
  );
}
