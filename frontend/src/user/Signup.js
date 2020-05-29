import React, { Component } from "react";
import { signup } from "../auth";
import { Link } from "react-router-dom";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      error: "",
      role: "",
    };
  }

  handleChange = (name) => (event) => {
    this.setState({ error: "" });
    this.setState({ [name]: event.target.value });
  };

  clickSubmit = (event) => {
    event.preventDefault();
    const { name, email, password, role } = this.state;
    const user = {
      name,
      email,
      password,
      role
    };
    signup(user).then((data) => {
      if (data.error) this.setState({ error: data.error });
      else
        this.setState({
          error: "",
          name: "",
          email: "",
          password: "",
          role: "",
          open: true,
        });
    });
  };

  signupForm = (name, email, password, role) => (
    <form>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={this.handleChange("name")}
          type="text"
          className="form-control"
          value={name}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={this.handleChange("email")}
          type="email"
          className="form-control"
          value={email}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={this.handleChange("password")}
          type="password"
          className="form-control"
          value={password}
        />
      </div>
      <label className="text-muted">Are you Admin?</label>
      <div className="form-check">
        <input
          onChange={this.handleChange("role")}
          className="form-check-input"
          type="radio"
          name="exampleRadios"
          id="exampleRadios1"
          value="subscriber"
        />
        <label className="form-check-label" for="exampleRadios1">
          No
        </label>
      </div>
      <div className="form-check">
        <input
          onChange={this.handleChange("role")}
          className="form-check-input"
          type="radio"
          name="exampleRadios"
          id="exampleRadios2"
          value="admin"
        />
        <label class="form-check-label" for="exampleRadios2">
          Yes
        </label>
      </div>

      <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">
        Submit
      </button>
    </form>
  );

  render() {
    const { name, email, password, role, error, open } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Signup</h2>

        
        <br />

        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        <div
          className="alert alert-info"
          style={{ display: open ? "" : "none" }}
        >
          New account is successfully created. Please{" "}
          <Link to="/signin">Sign In</Link>.
        </div>

        {this.signupForm(name, email, password, role)}
      </div>
    );
  }
}

export default Signup;
