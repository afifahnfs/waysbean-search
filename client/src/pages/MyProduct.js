import { Container, Image, Row, Col, Card, Alert } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { API } from "../config/api";
import convertRupiah from "rupiah-format";
import cssMp from "./styleModule/MyProduct.module.css";
import NavbarAdmin from "../components/NavbarAdmin";
import imgEmpty from "../images/undraw_clean_up_ucm0.svg";

export default function MyProduct() {
  let navigate = useNavigate();

  const [product, setProducts] = useState([]);

  const getProducts = async () => {
    try {
      const response = await API.get("/products");
      // Store product data to useState variabel
      setProducts(response.data.data.product);

      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  console.log(product);

  useEffect(() => {
    getProducts();
  }, []);

  // MOVE TO PAGE EDIT PRODUCT

  const handleUpdate = (id) => {
    navigate("/edit-product/" + id);
  };

  // DELETE PRODUCT

  const [message, setMessage] = useState(null);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/product/${id}`);
      getProducts();

      const alert = (
        <Alert variant="success" className="py-1">
          Delete success
        </Alert>
      );
      setMessage(alert);
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Delete Failed
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  };
  return (
    <div>
      <NavbarAdmin />
      <div className={cssMp.main}>
        <Container>
          <div className={cssMp.content}>
            {product.length !== 0 ? (
              <Row xs={1} md={4} className={`${cssMp.mainCard} g-4`}>
                {product?.map((item, index) => (
                  <Col key={index}>
                    <Card className={cssMp.wrapCard}>
                      <Card.Img
                        variant="top"
                        className={cssMp.photo}
                        src={item.photo}
                      />
                      <Card.Body className={cssMp.cardBody}>
                        <Card.Title className={cssMp.titleProduct}>
                          {item.name}
                        </Card.Title>
                        <Card.Text className={cssMp.textCard}>
                          {convertRupiah.convert(item.price)}
                        </Card.Text>
                        <Card.Text className={cssMp.textCard}>
                          Stock: {item.stock}
                        </Card.Text>
                        <div className="mt-2">
                          <button
                            className={cssMp.btnEdit}
                            onClick={() => {
                              handleUpdate(item.id);
                            }}
                          >
                            Edit Product
                          </button>
                        </div>
                        <div className="mt-2">
                          <button
                            className={cssMp.btnDelete}
                            onClick={() => {
                              handleDelete(item.id);
                            }}
                          >
                            Delete Product
                          </button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
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
    </div>
  );
}
