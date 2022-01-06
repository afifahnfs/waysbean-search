import { Container, Row, Col, Card, Image, Form, Modal } from "react-bootstrap";
import React, { useContext, useState } from "react";
import { OrderContext } from "../context/orderContext";
import { API } from "../config/api";

import convertRupiah from "rupiah-format";
import dateFormat from "dateformat";
import cssShip from "./styleModule/Shipping.module.css";
import NavbarUser from "../components/NavbarUser";

import imgEmpty from "../images/undraw_clean_up_ucm0.svg";
import file from "../images/Frame 1.png";
import logo from "../images/Frame.png";

export default function Shipping() {
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);

  const { orderMenus, setOrderMenus } = useContext(OrderContext);

  const order = orderMenus.carts;
  // console.log(order);

  const [preview, setPreview] = useState(null); //For image preview

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    poss_code: "",
    address: "",
    attachment: "",
    // products: dataTransaction,
  }); //Store product data

  // Handle change data on form
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    // Create image url for preview
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  console.log(form);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      let currentCarts = orderMenus.carts;

      // get id and qty
      let dataTransaction = currentCarts.map((element) => {
        return {
          id: element.item.id,
          orderQuantity: element.qty,
        };
      });

      const formData = new FormData();
      formData.set("attachment", form.attachment[0], form.attachment[0].name);
      formData.set("name", form.name);
      formData.set("email", form.email);
      formData.set("phone", form.phone);
      formData.set("poss_code", form.poss_code);
      formData.set("address", form.address);
      formData.set("products", JSON.stringify(dataTransaction));

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      // Insert transaction data
      const response = await API.post("/transaction", formData, config);

      console.log(response);
      setSuccess(true);
    } catch (error) {
      setFailed(true);
      console.log(error);
    }
  };

  return (
    <>
      <NavbarUser />
      <div className={cssShip.main}>
        <Container>
          <form onSubmit={handleSubmit}>
            <Row className={cssShip.row}>
              <Col>
                <h1 className={cssShip.title}>Shipping</h1>

                <div className="d-flex mb-3">
                  <div>
                    <Col>
                      <Form.Control
                        className={cssShip.input}
                        placeholder="Name"
                        name="name"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        className={cssShip.input}
                        placeholder="Email"
                        name="email"
                        type="email"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        className={cssShip.input}
                        placeholder="Phone"
                        name="phone"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        className={cssShip.input}
                        placeholder="Poss Code"
                        name="poss_code"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col>
                      <textarea
                        className={cssShip.textarea}
                        placeholder="Address"
                        name="address"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col className="d-flex">
                      <Form.Group controlId="formFile" className={cssShip.file}>
                        <Form.Label>
                          Attache of transaction
                          <Form.Control
                            type="file"
                            hidden
                            name="attachment"
                            aria-label="File browser example"
                            onChange={handleChange}
                          />
                          <Image className={cssShip.image} src={file}></Image>
                        </Form.Label>
                      </Form.Group>
                      {preview && (
                        <div>
                          <img
                            src={preview}
                            style={{
                              maxWidth: "150px",
                              maxHeight: "150px",
                              objectFit: "cover",
                              marginLeft: "20px",
                            }}
                            alt="preview"
                          />
                        </div>
                      )}
                    </Col>
                  </div>
                </div>
              </Col>
              {order.length !== 0 ? (
                <Col className={cssShip.left}>
                  {order?.map((elem, index) => (
                    <Card
                      className={`${cssShip.cardTransaction} mb-3`}
                      key={index}
                    >
                      <Card.Body className="d-flex mb-4">
                        <div>
                          <Image
                            className={cssShip.photo}
                            src={elem.item.photo}
                          />
                        </div>
                        <div className={cssShip.trsLeft}>
                          <h3 className={cssShip.namePartner}>
                            {elem.item.name}
                          </h3>
                          <p className={cssShip.tgl}>
                            {dateFormat(
                              elem.item.createdAt,
                              "dddd, d mmmm yyyy"
                            )}
                          </p>
                          <p className={cssShip.textTrs}>
                            {convertRupiah.convert(elem.item.price)}
                          </p>
                          <p className={cssShip.textTrs}>Qty: {elem.qty}</p>
                          <p className={cssShip.total}>
                            Sub Total:{" "}
                            {convertRupiah.convert(elem.item.price * elem.qty)}
                          </p>
                        </div>
                        <div className={cssShip.trsRight}>
                          <div>
                            <Image className={cssShip.logo} src={logo} />
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                  <div>
                    <button className={cssShip.btn}>Pay</button>
                  </div>
                </Col>
              ) : (
                <Col className={cssShip.left}>
                  <h1 className={cssShip.title}>History Transaction</h1>

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
            </Row>
          </form>
        </Container>
      </div>

      <Modal show={success} onHide={(e) => setSuccess(false)}>
        <Modal.Body
          style={{
            width: "500px",
            backgroundColor: "white",
            textAlign: "center",
            color: "blue",
            borderRadius: "5px",
          }}
        >
          Thank you for ordering in us, please wait 1 x 24 hours to verify you
          order
        </Modal.Body>
      </Modal>

      <Modal show={failed} onHide={(e) => setFailed(false)}>
        <Modal.Body
          style={{
            width: "500px",
            backgroundColor: "white",
            textAlign: "center",
            color: "blue",
            borderRadius: "5px",
          }}
        >
          Failed Add Product
        </Modal.Body>
      </Modal>
    </>
  );
}
