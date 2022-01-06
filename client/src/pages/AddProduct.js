import { Container, Row, Col, Image, Form, Modal } from "react-bootstrap";
import React, { useContext, useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
import { useNavigate } from "react-router";
import { UserContext } from "../context/userContext";
import { API } from "../config/api";

import cssAp from "./styleModule/AddProduct.module.css";
import NavbarAdmin from "../components/NavbarAdmin";

import file from "../images/Frame 1.png";

export default function AddProduct() {
  // console.clear();

  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);

  let navigate = useNavigate();

  const [preview, setPreview] = useState(null); //For image preview

  const [form, setForm] = useState({
    photo: "",
    name: "",
    price: "",
    stock: "",
    description: "",
  }); //Store product data

  console.log(form);

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

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // Configuration
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      console.log(form);

      // Store data with FormData as object
      const formData = new FormData();
      formData.set("photo", form.photo[0], form.photo[0].name);
      formData.set("name", form.name);
      formData.set("price", form.price);
      formData.set("description", form.description);
      formData.set("stock", form.stock);

      // Insert product data
      const response = await API.post("/product", formData, config);
      console.log(response);

      setSuccess(true);
    } catch (error) {
      setFailed(true);
      console.log(error);
    }
  };

  return (
    <div>
      <NavbarAdmin />
      <div className={cssAp.main}>
        <Container>
          <Row className={cssAp.row}>
            <Col>
              <h1 className={cssAp.title}>Add Product</h1>
              <form onSubmit={handleSubmit}>
                <div className="d-flex mb-3">
                  <div>
                    <Col>
                      <Form.Control
                        className={cssAp.input}
                        placeholder="Name"
                        name="name"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        className={cssAp.input}
                        placeholder="Stock"
                        name="stock"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        className={cssAp.input}
                        placeholder="Price"
                        name="price"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col>
                      <textarea
                        className={cssAp.textarea}
                        placeholder="Description"
                        name="description"
                        type="text"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col>
                      <Form.Group controlId="formFile" className={cssAp.file}>
                        <Form.Label>
                          Photo Product
                          <Form.Control
                            type="file"
                            hidden
                            name="photo"
                            aria-label="File browser example"
                            onChange={handleChange}
                          />
                          <Image className={cssAp.image} src={file}></Image>
                        </Form.Label>
                      </Form.Group>
                    </Col>
                    <div className="d-flex justify-content-center mt-5">
                      <button
                        className={cssAp.btn}
                        // onClick={(e) => onClickAdd(e)}
                      >
                        Add Product
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </Col>
            <Col className={cssAp.left}>
              {preview && (
                <div>
                  <img
                    src={preview}
                    style={{
                      marginLeft: "100px",
                      maxWidth: "436px",
                      width: "436px",
                      maxHeight: "555px",
                      height: "555px",
                      objectFit: "cover",
                    }}
                    alt="preview"
                  />
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      <Modal
        className={cssAp.modalContent}
        show={success}
        onHide={(e) => setSuccess(false)}
      >
        <Modal.Body
          style={{
            width: "500px",
            backgroundColor: "white",
            textAlign: "center",
            color: "blue",
            borderRadius: "5px",
          }}
        >
          Success Add Product
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
    </div>
  );
}
