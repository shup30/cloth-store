import React, { Component } from "react";
import { isAuthenticated } from "../auth";
import { create } from "./apiQuotation";
import { Redirect } from "react-router-dom";

class NewQuotation extends Component {
  constructor() {
    super();
    this.state = {
      cmp_name: "",
      issuer_name: "",
      issued_to: "",
      item: "",
      description: "",
      qty: "",
      price: "",
      total: "",
      error: "",
      loading: false,
      redirectToProfile: false,
    };
  }

  componentDidMount() {
    this.postData = new FormData();
    this.setState({ user: isAuthenticated().user });
  }

  isValid = () => {
    const { cmp_name, issuer_name, issued_to, description, details, price } = this.state;
  
    if (cmp_name.length === 0 || issuer_name.length === 0 || issued_to.length === 0 || description.length === 0 || price.length === 0) {
      this.setState({ error: "All fields are required", loading: false });
      return false;
    }
    return true;
  };

  handleChange = (name) => (event) => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;

    const fileSize = name === "photo" ? event.target.files[0].size : 0;
    this.postData.set(name, value);
    this.setState({ [name]: value, fileSize });
  };

  clickSubmit = (event) => {
    event.preventDefault();
    this.setState({ loading: true });

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;

      create(userId, token, this.postData).then((data) => {
        if (data.error) this.setState({ error: data.error });
        else {
          this.setState({
            loading: false,
            issuer_name: "",
            issuer_to: "",
            description: "",
            type: "",
            price: "",
            qty: "",
            redirectToProfile: true,
          });
        }
      });
    }
  };

  newPostForm = (cmp_name, issuer_name, issued_to, item, description, price, qty) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Company name</label>
        <input
          onChange={this.handleChange("cmp_name")}
          type="text"
          className="form-control"
          value={cmp_name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Issuer name</label>
        <input
          onChange={this.handleChange("issuer_name")}
          type="text"
          className="form-control"
          value={issuer_name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Issued To</label>
        <input
          onChange={this.handleChange("issued_to")}
          type="text"
          className="form-control"
          value={issued_to}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Item</label>
        <input
          onChange={this.handleChange("item")}
          type="text"
          className="form-control"
          value={item}
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
        <input
          onChange={this.handleChange("price")}
          type="number"
          className="form-control"
          value={price}
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Quantity</label>
        <input
          onChange={this.handleChange("qty")}
          type="number"
          className="form-control"
          value={qty}
        />
      </div>
     
      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Create Quotation
      </button>
    </form>
  );

  render() {
    const {
      cmp_name,
      issuer_name,
      issued_to,
      description,
      item,
      qty,
      price,
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
        <h2 className="mt-5 mb-5">Create a new Quotation</h2>
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
        {this.newPostForm(cmp_name, issuer_name, issued_to, item, description, price, qty)}
      </div>
    );
  }
}

export default NewQuotation;
