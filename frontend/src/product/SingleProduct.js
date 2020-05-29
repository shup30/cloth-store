import React, { Component } from "react";
import { singleProduct, remove } from "./apiProduct";
import DefaultPost from "../images/prod.png";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";

class SingleProduct extends Component {
  state = {
    product: "",
    redirectToHome: false,
    redirectToSignin: false,
  };

  componentDidMount = () => {
    const productId = this.props.match.params.productId;
    console.log("productId", productId);
    singleProduct(productId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          product: data,
        });
      }
    });
  };

  deletePost = () => {
    const productId = this.props.match.params.productId;
    const token = isAuthenticated().token;
    remove(productId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectToHome: true });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm("Are you sure you want to delete your post?");
    if (answer) {
      this.deletePost();
    }
  };

  renderPost = (product) => {
    const posterId = product.postedBy ? `/user/${product.postedBy._id}` : "";
    const posterName = product.postedBy ? product.postedBy.name : " Unknown";

    return (
      <div className="card-body">
        <img
          src={`${process.env.REACT_APP_API_URL}/product/photo/${product._id}`}
          alt={product.title}
          onError={(i) => (i.target.src = `${DefaultPost}`)}
          style={{ height: "200px", width: "auto" }}
          className="img-thumbnail"
        />

        <p className="card-text">{product.description}</p>
        <p className="card-text">Rs. {product.price}</p>
        <span class="badge badge-warning">{product.type}</span>
        <span class="badge badge-primary">{product.subtype}</span>
        <br />
        <p className="font-italic mark">
          Posted by <Link to={`${posterId}`}>{posterName} </Link>
        </p>

        <div className="d-inline-block">
          <div>
            {isAuthenticated().user && isAuthenticated().user.role === "admin" && (
              <div class="card mt-5">
                <div className="card-body">
                  <h5 className="card-title">Admin</h5>
                  <p className="mb-2 text-danger">Edit/Delete as an Admin</p>
                  <Link
                    to={`/product/edit/${product._id}`}
                    className="btn btn-raised btn-warning btn-sm mr-5"
                  >
                    Update Product
                  </Link>
                  <button
                    onClick={this.deleteConfirmed}
                    className="btn btn-raised btn-danger"
                  >
                    Delete Product
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { product, redirectToHome, redirectToSignin } = this.state;
    console.log(product);

    if (redirectToHome) {
      return <Redirect to={`/`} />;
    } else if (redirectToSignin) {
      return <Redirect to={`/signin`} />;
    }

    return (
      <div className="container">
        <h2 className="display-2 mt-5 mb-5">{product.title}</h2>

        {!product ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderPost(product)
        )}
      </div>
    );
  }
}

export default SingleProduct;
