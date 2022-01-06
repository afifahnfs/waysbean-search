import React from "react";
import { Link } from "react-router-dom";
import { Card, Col } from "react-bootstrap";

import convertRupiah from "rupiah-format";
import cssHome from "../pages/styleModule/Home.module.css";

export default function CardProduct({ item }) {
  // console.log(item);

  return (
    <Link to={`/detail-product/` + item.id} style={{ textDecoration: "none" }}>
      <Col>
        <Card className={cssHome.wrapCard}>
          <Card.Img variant="top" className={cssHome.photo} src={item.photo} />
          <Card.Body className={cssHome.cardBody}>
            <h1 className={cssHome.titleProduct}>{item.name}</h1>
            <Card.Text className={cssHome.textCard}>
              {convertRupiah.convert(item.price)}
            </Card.Text>
            <Card.Text className={cssHome.textCard}>
              Stock: {item.stock}
            </Card.Text>
          </Card.Body>
        </Card>
      </Col>
    </Link>
  );
}
