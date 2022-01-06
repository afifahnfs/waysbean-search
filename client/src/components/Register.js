import { Navbar, Modal, Form, Alert } from "react-bootstrap";
import { useState } from "react";
import { API } from "../config/api";
import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "../style/style.css";

import Login from "../components/Login";

export default function Register({ showRegister, registerClose }) {
  const [message, setMessage] = useState(null);

  // store data with useState
  const [form, setForm] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const { email, password, fullName } = form;

  // console.log(form)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // convert form data to string
      const body = JSON.stringify(form);

      // Insert data user to database
      const response = await API.post("/register", body, config);

      console.log(response)

      // Notification
      if (response.data.status === "success") {
        const alert = (
          <Alert variant="success" className="py-1">
            Success
          </Alert>
        );
        setMessage(alert);
      } else {
        const alert = (
          <Alert variant="danger" className="py-1">
            Failed
          </Alert>
        );
        setMessage(alert);
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Failed
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  };

  const [showLogin, setLogin] = useState(false);
  const loginClose = () => setLogin(false);
  const loginShow = () => setLogin(true);

  const ModalLogin = () => {
    registerClose();
    loginShow();
  };

  return (
    <>
      <Modal show={showRegister} onHide={registerClose}>
        <Modal.Body className="border-regislog">
          <h1 className="title">Register</h1>
          {message && message}
          <form onSubmit={handleSubmit}>
            <Form.Group className=" mb-3">
              <Form.Control
                className="input"
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={email}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                className="input"
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={password}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                className="input"
                type="text"
                placeholder="Full Name"
                name="fullName"
                onChange={handleChange}
                value={fullName}
              />
            </Form.Group>
            <button className="btn" variant="primary" type="submit">
              Register
            </button>
          </form>
          <div className="text-modal">
            <Form.Text>
              Already have an account ? Klik
              <button className="btn-here" onClick={ModalLogin}>
                Here
              </button>
            </Form.Text>
          </div>
        </Modal.Body>
      </Modal>

      {/* <Login showLogin={showLogin} loginClose={loginClose} /> */}
    </>
  );
}
