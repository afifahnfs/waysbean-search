import { Container, Row, Col, Form, Image, Modal } from "react-bootstrap";
import { useNavigate } from "react-router";
import React, { useState, useEffect } from "react";
import { API } from "../config/api";

import cssPd from "./styleModule/EditProfile.module.css";
import NavbarUser from "../components/NavbarUser";
import file from "../images/Frame 1.png";

export default function EditProfile() {
  let navigate = useNavigate();

  const [preview, setPreview] = useState(null); //For image preview
  const [profile, setProfile] = useState({}); //Profile data

  // Create Variabel for profile product data here ...
  const [form, setForm] = useState({
    image: "",
    fullName: "",
    email: "",
  }); //profile data

  // Create function get product data by id from database here ...
  const getProfile = async () => {
    try {
      const response = await API.get("/user");
      // Store product data to useState variabel
      setPreview(response.data.data.user.image);
      setForm({
        ...form,
        fullName: response.data.data.user.fullName,
        email: response.data.data.user.email,
      });
      setProfile(response.data.data.user);

      console.log(response.data.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
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
      if (form.image) {
        formData.set("image", form?.image[0], form?.image[0]?.name);
      }
      formData.set("fullName", form.fullName);
      formData.set("email", form.email);

      // Insert product data
      const response = await API.patch(`/user`, formData, config);

      console.log(response.data);
      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, [profile]);

  return (
    <>
      <NavbarUser />
      <div className={cssPd.main}>
        <Container>
          <div className={cssPd.row}>
            <h1 className={cssPd.title}>Edit Profile</h1>
            <form onSubmit={handleSubmit}>
              <Row>
                <Col xs={3} className="float-xl-end mb-3">
                  {preview && (
                    <div>
                      <img
                        src={preview}
                        style={{
                          maxWidth: "150px",
                          maxHeight: "150px",
                          objectFit: "cover",
                        }}
                        alt="preview"
                      />
                    </div>
                  )}
                </Col>
              </Row>
              <Row className={cssPd.wrap}>
                <Col xs={9}>
                  <input
                    className={cssPd.inputForm}
                    placeholder="Full Name"
                    name="fullName"
                    onChange={handleChange}
                    value={form.fullName}
                  />
                </Col>
                <Col>
                  <Form.Group controlId="formFile">
                    <label className={cssPd.btnFile}>
                      Attach Image
                      <input
                        type="file"
                        name="image"
                        hidden
                        onChange={handleChange}
                      />
                      <Image className={cssPd.file} src={file}></Image>
                    </label>
                  </Form.Group>
                </Col>
              </Row>
              <Row className={cssPd.wrap}>
                <Col xs={12}>
                  <input
                    className={cssPd.inputForm}
                    placeholder="Email"
                    name="email"
                    onChange={handleChange}
                    value={form.email}
                  />
                </Col>
              </Row>
              <Col xs={3} className="float-xl-end mt-3">
                <button
                  type="submit"
                  variant="success"
                  className={cssPd.btnSave}
                >
                  Save
                </button>
              </Col>
            </form>
          </div>
        </Container>
      </div>
    </>
  );
}
