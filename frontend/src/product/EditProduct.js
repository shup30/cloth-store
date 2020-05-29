import React, { Component } from "react";
import { singleProduct, update } from "./apiProduct";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";
import DefaultProduct from "../images/prod.png";

class EditProduct extends Component {
  constructor() {
    super();
    this.state = {
      id: "",
      title: "",
      description: "",
      price: "",
      redirectToProfile: false,
      error: "",
      fileSize: 0,
      loading: false,
    };
  }

  init = (productId) => {
    singleProduct(productId).then((data) => {
      console.log("data:", data);
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        this.setState({
          id: data.postedBy._id,
          title: data.title,
          description: data.description,
          price: data.price,
          error: "",
        });
      }
    });
  };

  componentDidMount() {
    this.productData = new FormData();
    const productId = this.props.match.params.productId;
    this.init(productId);
  }

  isValid = () => {
    const { title, description, fileSize } = this.state;
    if (fileSize > 1000000) {
      this.setState({
        error: "File size should be less than 100kb",
        loading: false,
      });
      return false;
    }
    if (title.length === 0 || description.length === 0) {
      this.setState({ error: "All fields are required", loading: false });
      return false;
    }
    return true;
  };

  handleChange = (name) => (event) => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.productData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const productId = this.props.match.params.productId;
      const token = isAuthenticated().token;

      update(productId, token, this.productData).then((data) => {
        if (data.error) this.setState({ error: data.error });
        else {
          this.setState({
            loading: false,
            title: "",
            description: "",
            price: "",
            redirectToProfile: true,
          });
        }
      });
    }
  };

  editProductForm = (title, description, price) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Product Photo</label>
        <input
          onChange={this.handleChange("photo")}
          type="file"
          accept="image/*"
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Title</label>
        <input
          onChange={this.handleChange("title")}
          type="text"
          className="form-control"
          value={title}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Description</label>
        <textarea
          onChange={this.handleChange("description")}
          type="text"
          className="form-control"
          value={description}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Price</label>
        <textarea
          onChange={this.handleChange("price")}
          type="text"
          className="form-control"
          value={price}
        />
      </div>

      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Update Product
      </button>
    </form>
  );

  render() {
    const {
      id,
      title,
      description,
      price,
      redirectToProfile,
      error,
      loading,
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">{title}</h2>

        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        {loading ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          ""
        )}

        <img
          style={{ height: "200px", width: "auto" }}
          className="img-thumbnail"
          src={`${
            process.env.REACT_APP_API_URL
          }/product/photo/${id}?${new Date().getTime()}`}
          onError={(i) => (i.target.src = `${DefaultProduct}`)}
          alt={title}
        />

        {isAuthenticated().user.role === "admin" &&
          this.editProductForm(title, description, price)}

        {isAuthenticated().user._id === id ||
          (isAuthenticated().user.role !== "admin" &&
            this.editProductForm(title, description, price))}
      </div>
    );
  }
}

export default EditProduct;
