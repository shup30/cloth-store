import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { create } from "./apiProduct";
import { Redirect } from "react-router-dom";

class NewProduct extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      description: "",
      type: "",
      subtype: "",
      price: "",
      photo: "",
      error: "",
      user: {},
      fileSize: 0,
      loading: false,
      redirectToProfile: false,
    };
  }

  componentDidMount() {
    this.productData = new FormData();
    this.setState({ user: isAuthenticated().user });
  }

  isValid = () => {
    const { title, description, fileSize, price } = this.state;
    const re = /^[0-9\b]+$/;

    if (fileSize > 100000) {
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

    // if (price === "" || re.test(price)) {
    //   this.setState({ error: "Price must be Number", loading: false });
    //   return false;
    // }
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
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;

      create(userId, token, this.productData).then((data) => {
        if (data.error) this.setState({ error: data.error });
        else {
          this.setState({
            loading: false,
            title: "",
            description: "",
            type: "",
            price: "",
            redirectToProfile: true,
          });
        }
      });
    }
  };

  newPostForm = (title, description, price, type, subtype) => (
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
        <label className="text-muted">Product Title</label>
        <input
          onChange={this.handleChange("title")}
          type="text"
          className="form-control"
          value={title}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Product Description</label>
        <textarea
          onChange={this.handleChange("description")}
          type="text"
          className="form-control"
          value={description}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Product Price(Rs.)</label>
        <input
          onChange={this.handleChange("price")}
          type="number"
          className="form-control"
          value={price}
        />
      </div>
      <div class="form-group">
        <label className="text-muted" for="exampleFormControlSelect1">
          Product Type
        </label>
        <select
          class="form-control form-control-sm"
          id="exampleFormControlSelect1"
          value={this.state.type}
          onChange={this.handleChange("type")}
        >
          <option>Please Select option</option>
          <option>Cloth</option>
          <option>Button</option>
          <option>Thread</option>
        </select>
      </div>

      {this.state.type == "Cloth" ? (
        <div class="form-group">
          <label className="text-muted" for="exampleFormControlSelect1">
            Cloth Color
          </label>
          <select
            class="form-control form-control-sm"
            id="exampleFormControlSelect1"
            value={this.state.subtype}
            onChange={this.handleChange("subtype")}
          >
            <option>Select cloth color</option>
            <option>Red</option>
            <option>Green</option>
            <option>Blue</option>
          </select>
        </div>
      ) : this.state.type == "Button" ? (
        <div class="form-group">
          <label className="text-muted" for="exampleFormControlSelect1">
            Button type
          </label>
          <select
            class="form-control form-control-sm"
            id="exampleFormControlSelect1"
            value={this.state.subtype}
            onChange={this.handleChange("subtype")}
          >
            <option>Button Type</option>
            <option>Flat</option>
            <option>Hook</option>
            <option>Shank</option>
          </select>
        </div>
      ) : this.state.type == "Thread" ? (
        <div class="form-group">
          <label className="text-muted" for="exampleFormControlSelect1">
            Thread type
          </label>
          <select
            class="form-control form-control-sm"
            id="exampleFormControlSelect1"
            value={this.state.subtype}
            onChange={this.handleChange("subtype")}
          >
            <option>Thread Type</option>
            <option>Linen</option>
            <option>Silk</option>
            <option>Cotton</option>
          </select>
        </div>
      ): (
        <div class="form-group">
        <label className="text-muted" for="exampleFormControlSelect1">
          Product Sub-Type 
        </label>
        <select
          class="form-control form-control-sm"
          id="exampleFormControlSelect1"
          value={this.state.subtype}
          onChange={this.handleChange("subtype")}
        >
          <option>Please Select type first</option>
        </select>
      </div>
      )}

      {/* <label className="text-muted">Product Type</label>
      <div className="form-check">
        <input
          onChange={this.handleChange("type")}
          className="form-check-input"
          type="radio"
          name="exampleRadios"
          id="exampleRadios1"
          value="cloths"
        />
        <label className="form-check-label" for="exampleRadios1">
          Cloths
        </label>
      </div>
      <div className="form-check">
        <input
          onChange={this.handleChange("type")}
          className="form-check-input"
          type="radio"
          name="exampleRadios"
          id="exampleRadios2"
          value="button"
        />
        <label class="form-check-label" for="exampleRadios2">
          Button
        </label>
      </div>
      <div className="form-check">
        <input
          onChange={this.handleChange("type")}
          className="form-check-input"
          type="radio"
          name="exampleRadios"
          id="exampleRadios3"
          value="thread"
        />
        <label class="form-check-label" for="exampleRadios3">
          Thread
        </label>
      </div> */}

      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Create Product
      </button>
    </form>
  );

  render() {
    const {
      title,
      description,
      price,
      type,
      subtype,
      photo,
      user,
      error,
      loading,
      redirectToProfile,
    } = this.state;

    if (redirectToProfile) {
      return <Redirect to={`/user/${user._id}`} />;
    }

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Create a new product</h2>
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

        {this.newPostForm(title, description, price, type, subtype)}
      </div>
    );
  }
}

export default NewProduct;
