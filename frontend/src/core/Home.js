import React from "react";
import Product from "../product/Products";
import { Link } from "react-router-dom";


const Home = () => (
  <div>
      <div className="columns">
        <div className="container is-fluid">
          <div className="column is-2">
            <a 
              className="btn btn-raised btn-info mr-5 mt-5"
              href="/product/create"
            >
              Add New Product
            </a>
            <Product />

          </div>
        </div>
      </div>
  </div>
);

export default Home;
