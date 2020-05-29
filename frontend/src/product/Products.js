import React, { Component } from "react";
import { list } from "./apiProduct";
import DefaultProduct from "../images/prod.png";
import { Link } from "react-router-dom";

class Products extends Component {
  constructor() {
    super();
    this.state = {
      products: [],
      page: 1,
    };
  }

  loadPosts = (page) => {
    list(page).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ products: data });
      }
    });
  };

  componentDidMount() {
    this.loadPosts(this.state.page);
  }

  loadMore = (number) => {
    this.setState({ page: this.state.page + number });
    this.loadPosts(this.state.page + number);
  };

  loadLess = (number) => {
    this.setState({ page: this.state.page - number });
    this.loadPosts(this.state.page - number);
  };

  renderPosts = (products) => {
    return (
      <div className="row">
        {products.map((product, i) => {
          const posterId = product.postedBy ? `/user/${product.postedBy._id}` : "";
          const posterName = product.postedBy ? product.postedBy.name : " Unknown";

          return (
            <div className="card col-md-4" key={i}>
              <div className="card-body">
                <img
                  src={`${process.env.REACT_APP_API_URL}/product/photo/${product._id}`}
                  alt={product.title}
                  onError={(i) => (i.target.src = `${DefaultProduct}`)}
                  className="img-thunbnail mb-2"
                  style={{ height: "200px", width: "100%" }}
                />
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">
                  {product.description.substring(0, 100)}
                </p>
                <span class="badge badge-warning">{product.type}</span>
                <span class="badge badge-primary">{product.subtype}</span>

                <p className="card-text">Rs. {product.price}</p>
                <br />
                <p className="font-italic">
                  Posted by <Link to={`${posterId}`}>{posterName} </Link>
                </p>
                <Link
                  to={`/product/${product._id}`}
                  className="btn btn-raised btn-primary btn-sm"
                >
                  View Product
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { products, page } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">
          {!products.length ? "No more products!" : "Recent Products"}
        </h2>

        {this.renderPosts(products)}

        {page > 1 ? (
          <button
            className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
            onClick={() => this.loadLess(1)}
          >
            Previous ({this.state.page - 1})
          </button>
        ) : (
          ""
        )}

        {products.length ? (
          <button
            className="btn btn-raised btn-dark mt-5 mb-5"
            onClick={() => this.loadMore(1)}
          >
            Next ({page + 1})
          </button>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Products;
