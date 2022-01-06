import { Container, Image, Row, Col, Card } from "react-bootstrap";
import { useState, useEffect } from "react";
import { API } from "../config/api";

import cssHome from "./styleModule/Home.module.css";
import NavbarUser from "../components/NavbarUser";
import CardProduct from "../components/CardProduct";
import imgEmpty from "../images/undraw_clean_up_ucm0.svg";
import brand from "../images/Icon.png";
import foto from "../images/Rectangle 3.png";
import wave from "../images/waves 1.png";

function Home() {
  const [products, setProducts] = useState([]);

  const getProduct = async () => {
    try {
      const response = await API.get("/products");
      // Store product data to useState variabel
      setProducts(response.data.data.product);

      console.log(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(products);

  useEffect(() => {
    getProduct();
  }, []);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const searchHandler = (searchKeyword) => {
    setSearchKeyword(searchKeyword);

    if (searchKeyword !== "") {
      const newProduct = products.filter((product) => {
        return Object.values(product)
          .join(" ")
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());
      });
      setSearchResult(newProduct);
    } else {
      setSearchResult(products);
    }
  };

  console.log(searchResult);

  return (
    <div>
      <NavbarUser searchFunction={searchHandler} keyword={searchKeyword} />
      <div className={cssHome.top}>
        <div className={cssHome.topMain}>
          <div className={cssHome.topMainLeft}>
            <Image className={cssHome.brand} src={brand} />
            <p className={cssHome.topH1}>BEST QUALITY COFFEE BEANS</p>
            <p className={cssHome.topText}>
              Quality freshly roasted coffee made just for you.
            </p>
            <p className={cssHome.topText}>Pour, brew and enjoy</p>
            <div className={cssHome.topSpace}></div>
          </div>
          <div>
            <div>
              <Image src={foto} className={cssHome.fotoKopi} />
            </div>
            <Image src={wave} className={cssHome.waves} />
          </div>
        </div>
      </div>
      <div className={cssHome.main}>
        <Container>
          <div className={cssHome.content}>
            {searchKeyword.length < 1 ? (
              <Row xs={1} md={4} className={`${cssHome.mainCard} g-4`}>
                {products?.map((item, index) => (
                  <CardProduct item={item} key={index} />
                ))}
              </Row>
            ) : searchKeyword.length > 0 ? (
              <Row xs={1} md={4} className={`${cssHome.mainCard} g-4`}>
                {searchResult?.map((item, index) => (
                  <CardProduct item={item} key={index} />
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

export default Home;
