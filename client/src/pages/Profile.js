import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Alert,
  Modal,
} from "react-bootstrap";
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { API } from "../config/api";

import cssProfile from "./styleModule/Profile.module.css";
import NavbarUser from "../components/NavbarUser";
import convertRupiah from "rupiah-format";
import dateFormat from "dateformat";

import logo from "../images/Frame.png";
import barcode from "../images/Group 10.png";
import imgEmpty from "../images/undraw_clean_up_ucm0.svg";
import noPhoto from "../images/No-photo-m.png";

export default function Profile() {
  let navigate = useNavigate();

  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    getProfile();
    getTransactions();
  }, []);

  function handleClick() {
    navigate("/edit-profile");
  }

  const [profile, setProfile] = useState({});

  // Fetching profile data from database
  const getProfile = async () => {
    console.log("test profile");
    try {
      const response = await API.get("/user");
      // Store product data to useState variabel
      setProfile(response.data.data.user);

      console.log(response.data.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  const [transactions, setTransactions] = useState([]);

  // Fetching transaction data from database
  const getTransactions = async () => {
    console.log("test transaction");
    try {
      const response = await API.get("/my-transactions");
      // Store product data to useState variabel
      setTransactions(response.data.data);

      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSuccess = async (e, id) => {
    try {
      e.preventDefault();

      const data = {
        status: "success",
      };

      console.log(data);

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Update transaction data
      const response = await API.patch(`/transaction/${id}`, data, config);

      setSuccess(true);
      navigate("/profile");

      console.log(response);
    } catch (error) {
      setFailed(true);
      navigate("/profile");

      console.log(error);
    }
  };

  return (
    <>
      <NavbarUser />
      <div className={cssProfile.main}>
        <Container>
          <Row className={cssProfile.row}>
            <Col>
              <h1 className={cssProfile.title}>My Profile</h1>
              <div className="d-flex mb-3">
                <div>
                  <Image
                    className={cssProfile.imgProfile}
                    src={
                      profile.image === "http://localhost:5000/uploads/null"
                        ? noPhoto
                        : profile.image
                    }
                  />
                </div>
                <div className="mt-2">
                  <h5 className={cssProfile.label}>Full Name</h5>
                  <p className={cssProfile.isi}>{profile.fullName}</p>

                  <h5 className={cssProfile.label}>Email</h5>
                  <p className={cssProfile.isi}>{profile.email}</p>
                </div>
              </div>
              <button className={cssProfile.btnProfile} onClick={handleClick}>
                Edit Profile
              </button>
            </Col>
            {transactions.length !== 0 ? (
              <Col className={cssProfile.left}>
                <h1 className={cssProfile.title}>History Transaction</h1>
                {transactions?.map((item, index) => (
                  <div key={index}>
                    {item.order.map((elem, index) => (
                      <Card
                        className={`${cssProfile.cardTransaction} mb-3`}
                        key={index}
                      >
                        <Card.Body className="d-flex mb-4">
                          <div>
                            <Image
                              className={cssProfile.poto}
                              src={
                                "http://localhost:5000/uploads/" +
                                elem.products.photo
                              }
                            />
                          </div>
                          <div className={cssProfile.trsLeft}>
                            <h3 className={cssProfile.namePartner}>
                              {elem.products.name}
                            </h3>
                            <p className={cssProfile.tgl}>
                              {dateFormat(
                                elem.products.createdAt,
                                "dddd, d mmmm yyyy"
                              )}
                            </p>
                            <p className={cssProfile.textTrs}>
                              Price:{" "}
                              {convertRupiah.convert(elem.products.price)}
                            </p>
                            <p className={cssProfile.textTrs}>
                              Qty: {elem.orderQuantity}
                            </p>
                            <p className={cssProfile.total}>
                              Total:{" "}
                              {convertRupiah.convert(
                                elem.products.price * elem.orderQuantity
                              )}
                            </p>
                          </div>
                          <div className={cssProfile.trsRight}>
                            <div>
                              <Image className={cssProfile.logo} src={logo} />
                              <Image
                                className={cssProfile.barcode}
                                src={barcode}
                              />
                            </div>
                            <div>
                              {item.status === "success" ? (
                                <button className={cssProfile.btnTrs}>
                                  Finished
                                </button>
                              ) : item.status === "waiting approve" ? (
                                <button className={cssProfile.btnTrsApprove}>
                                  {item.status}
                                </button>
                              ) : item.status === "on the way" ? (
                                <button
                                  className={cssProfile.btnTrsOtw}
                                  onClick={(e) => onSuccess(e, item.id)}
                                >
                                  Completed
                                </button>
                              ) : (
                                <button className={cssProfile.btnTrsCancel}>
                                  {item.status}
                                </button>
                              )}
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                ))}
              </Col>
            ) : (
              <Col className={cssProfile.left}>
                <h1 className={cssProfile.title}>History Transaction</h1>

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
          Transaction Success
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
          Transaction Failed
        </Modal.Body>
      </Modal>
    </>
  );
}
