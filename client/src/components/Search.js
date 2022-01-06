import React, { useState } from "react";
import { Form, FormControl, Image } from "react-bootstrap";

import SearchIcon from "@mui/icons-material/Search";
// import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import imgSearch from "../images/search.png";

export default function Search(props) {
  const [keyword, setKeyword] = useState(" ");

  const searchHandle = (e) => {
    setKeyword(e.target.value);

    props.searchFunction(e.target.value);
  };

  return (
    <>
      <Form className="d-flex">
        <input
          type="text"
          placeholder="Search Poduct..."
          className="search"
          value={keyword}
          onChange={searchHandle}
        />
        <button className="btn-search">
          <SearchIcon sx={{ fontSize: 35, color: "#433434" }} />
        </button>
      </Form>
    </>
  );
}
