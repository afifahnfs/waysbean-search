import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Col, Alert, Modal } from "react-bootstrap";
import { API } from "../config/api";

import cssIncomeTrs from "./styleModule/IncomeTrs.module.css";
import NavbarAdmin from "../components/NavbarAdmin";

import cancel from "../images/cancel 1.png";
import success from "../images/Group (1).png";
import imgEmpty from "../images/undraw_clean_up_ucm0.svg";

export default function IncomeTransaction() {
  const [successModal, setSuccessModal] = useState(false);
  const [failed, setFailed] = useState(false);

  const [message, setMessage] = useState(null);

  const [transactionPartner, setTransactionPartner] = useState([]);

  let navigate = useNavigate();

  const getTransaction = async () => {
    try {
      const response = await API.get("/transactions");
      // Store product data to useState variabel
      setTransactionPartner(response.data.data);

      navigate("/income");
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(transactionPartner);

  const onSuccess = async (e, id) => {
    try {
      e.preventDefault();

      const data = {
        status: "on the way",
      };

      console.log(data);

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Update transaction data
      const response = await API.patch(`/transaction/${id}`, data, config);

      console.log(response);
      setSuccessModal(true);
      setMessage("Approve Success");

      navigate("/income");
    } catch (error) {
      setFailed(true);

      setMessage("Approve failed");

      navigate("/income");
      console.log(error);
    }
  };

  const onCancel = async (e, id) => {
    try {
      e.preventDefault();

      const data = {
        status: "cancel",
      };

      console.log(id);

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // Update transaction data
      const response = await API.patch(`/transaction/${id}`, data, config);

      console.log(response);

      setSuccessModal(true);
      setMessage("Cancel Transaction Success");

      navigate("/income");
    } catch (error) {
      setFailed(true);

      setMessage("Cancel Transaction failed");

      navigate("/income");

      console.log(error);
    }
  };

  useEffect(() => {
    getTransaction();
  }, []);

  return (
    <>
      <NavbarAdmin />
      <div className={cssIncomeTrs.main}>
        <Container>
          <div className={cssIncomeTrs.row}>
            <h1 className={cssIncomeTrs.title}>Income Tansaction</h1>
            {transactionPartner.length !== 0 ? (
              <table>
                <tr className={cssIncomeTrs.tableTop}>
                  <th>No</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Poss Code</th>
                  <th>Products Order</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
                </tr>
                {transactionPartner?.map((item, index) => (
                  <tr className={cssIncomeTrs.tableBody}>
                    <td>{index + 1}</td>
                    <td>{item.name}</td>
                    <td>{item.address}</td>
                    <td>{item.poss_code}</td>
                    <td>
                      {item.order.map((elm) => {
                        return elm.products.name;
                      })}
                    </td>
                    {item.status === "waiting approve" ? (
                      <td className={cssIncomeTrs.approve}>{item.status}</td>
                    ) : item.status === "success" ? (
                      <td className={cssIncomeTrs.success}>{item.status}</td>
                    ) : item.status === "on the way" ? (
                      <td className={cssIncomeTrs.otw}>{item.status}</td>
                    ) : (
                      <td className={cssIncomeTrs.cancel}>{item.status}</td>
                    )}
                    <td>
                      {item.status === "waiting approve" ? (
                        <div className="d-flex justify-content-around">
                          <button
                            className={cssIncomeTrs.btnCancel}
                            variant="primary"
                            size="sm"
                            onClick={(e) => onCancel(e, item.id)}
                          >
                            Cancel
                          </button>

                          <button
                            className={cssIncomeTrs.btnApprove}
                            variant="secondary"
                            size="sm"
                            onClick={(e) => onSuccess(e, item.id)}
                          >
                            Approve
                          </button>
                        </div>
                      ) : item.status === "success" ? (
                        <div className="d-flex justify-content-center">
                          <img src={success} alt="" />
                        </div>
                      ) : item.status === "on the way" ? (
                        <div className="d-flex justify-content-center">
                          <img src={success} alt="" />
                        </div>
                      ) : (
                        <div className="d-flex justify-content-center">
                          <img src={cancel} alt="" />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </table>
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
          </div>
        </Container>
      </div>

      <Modal show={successModal} onHide={(e) => setSuccessModal(false)}>
        <Modal.Body
          style={{
            width: "500px",
            backgroundColor: "white",
            textAlign: "center",
            color: "blue",
            borderRadius: "5px",
          }}
        >
          {message}
        </Modal.Body>
      </Modal>

      <Modal show={failed} onHide={(e) => setFailed(false)}>
        <Modal.Body
          style={{
            width: "500px",
            backgroundColor: "white",
            textAlign: "center",
            color: "red",
            borderRadius: "5px",
          }}
        >
          {message}
        </Modal.Body>
      </Modal>
    </>
  );
}
