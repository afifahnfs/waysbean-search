import { Container, Row, Col, Image, Form } from "react-bootstrap";
import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
import { useNavigate, useParams } from "react-router";
import { API } from "../config/api";

import cssAp from "./styleModule/AddProduct.module.css";
import NavbarAdmin from "../components/NavbarAdmin";

import file from "../images/Frame 1.png";

export default function EditProduct() {
  // console.clear();

  let navigate = useNavigate();

  const { id } = useParams();

  const [preview, setPreview] = useState(null); //For image preview
  const [product, setProduct] = useState({}); //Store product data

  // Create Variabel for store product data here ...
  const [form, setForm] = useState({
    photo: "",
    name: "",
    price: "",
    stock: "",
    description: "",
  }); //Store product data

  console.log(form);
  // Create function get product data by id from database here ...
  const getProduct = async (id) => {
    try {
      const response = await API.get("/product/" + id);
      // Store product data to useState variabel
      setPreview(response.data.data.photo);
      setForm({
        ...form,
        name: response.data.data.name,
        price: response.data.data.price,
        stock: response.data.data.stock,
        description: response.data.data.description,
      });
      setProduct(response.data.data);

      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Call function get product with useEffect didMount here ...
  useEffect(() => {
    getProduct(id);
  }, []);

  // Create function for handle change data on form here ...
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

  // Create function for handle submit data ...
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      // Configuration
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      // Store data with FormData as object
      const formData = new FormData();
      if (form.photo) {
        formData.set("photo", form?.photo[0], form?.photo[0]?.name);
      }
      formData.set("name", form.name);
      formData.set("price", form.price);
      formData.set("stock", form.stock);
      formData.set("description", form.description);

      // Insert product data
      const response = await API.patch(
        `/product/${product.id}`,
        formData,
        config
      );
      console.log(response.data);

      navigate("/my-product");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, [product]);

  return (
    <>
      <NavbarAdmin />
      <div className={cssAp.main}>
        <Container>
          <Row className={cssAp.row}>
            <Col>
              <h1 className={cssAp.title}>Edit Product</h1>
              <form onSubmit={handleSubmit}>
                <div className="d-flex mb-3">
                  <div>
                    <Col>
                      <Form.Control
                        className={cssAp.input}
                        placeholder="Name"
                        name="name"
                        onChange={handleChange}
                        value={form.name}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        className={cssAp.input}
                        placeholder="Stock"
                        name="stock"
                        onChange={handleChange}
                        value={form.stock}
                      />
                    </Col>
                    <Col>
                      <Form.Control
                        className={cssAp.input}
                        placeholder="Price"
                        name="price"
                        onChange={handleChange}
                        value={form.price}
                      />
                    </Col>
                    <Col>
                      <textarea
                        className={cssAp.textarea}
                        placeholder="Description"
                        name="description"
                        onChange={handleChange}
                        value={form.description}
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
                      <button className={cssAp.btn}>Edit Product</button>
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
    </>
  );
}
