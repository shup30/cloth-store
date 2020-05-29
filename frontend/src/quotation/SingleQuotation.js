import React, { Component } from "react";
import { singleQuotation, remove } from "./apiQuotation";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { Col, Divider, Row, Table } from "antd";
import "antd/dist/antd.css";

class SingleQuotation extends Component {
  state = {
    quotation: "",
    redirectToHome: false,
    redirectToSignin: false,
  };

  componentDidMount = () => {
    const quotationId = this.props.match.params.quotationId;
    singleQuotation(quotationId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          quotation: data,
        });
      }
    });
  };

  deleteQuotation = () => {
    const quotationId = this.props.match.params.quotationId;
    const token = isAuthenticated().token;
    remove(quotationId, token).then((data) => {
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
      this.deleteQuotation();
    }
  };

  renderQuotation = (quotation) => {
    const posterId = quotation.postedBy ? `/user/${quotation.postedBy._id}` : "";
    const posterName = quotation.postedBy ? quotation.postedBy.name : " Unknown";
    var date = new Date(quotation.created);

    return (
      <>
        <div style={{ padding: 20 }}>
          <Row>
            <Col>
              <strong>Quotation</strong>
            </Col>
          </Row>

          <Row gutter={24} style={{ marginTop: 32 }}>
            <Col span={8}>
              <h3>{quotation.cmp_name}</h3>
              <div>#944/945, 4th Cross, 9th Main,</div>
              <div> Sector 21, Kamothe,</div>
              <div>Navi Mumbai,</div>
              <div>Maharashtra - 410210</div>
            </Col>
            <Col span={8} offset={8}>
              <table>
                <tr>
                  <th>Invoice # :</th>
                  <td>1</td>
                </tr>
                <tr>
                  <th>Invoice Date :</th>
                  <td>{date.toLocaleDateString()}</td>
                </tr>
              </table>
            </Col>
          </Row>

          <table class="table">
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Description</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{quotation.item}</td>
                <td>{quotation.description}</td>
                <td>{quotation.qty}</td>
                <td>{quotation.price}</td>
              </tr>
            </tbody>
          </table>

          <Row style={{ marginTop: 48 }}>
            <Col span={8} offset={16}>
              <table>
                <tr>
                  <th>Gross Total :</th>
                  <td>{quotation.price * quotation.qty}</td>
                </tr>
                <tr>
                  <th>IGST @6% :</th>
                  <td>{quotation.price * quotation.qty * 0.6} </td>
                </tr>
                <tr>
                  <th>Nett Total :</th>
                  <td>
                    {quotation.price * quotation.qty * 0.6 + quotation.price * quotation.qty}
                  </td>
                </tr>
              </table>
            </Col>
          </Row>
          <br/> <br/> <br/>
        </div>
        <div className="card-body">
          <div className="d-inline-block">
            <Link to={`/quotations`} className="btn btn-raised btn-primary btn-sm mr-5">
              Back to Quotations
            </Link>

            {isAuthenticated().user &&
              isAuthenticated().user._id === quotation.postedBy._id && (
                <>
                  <button
                    onClick={this.deleteConfirmed}
                    className="btn btn-raised btn-danger"
                  >
                    Delete Quotation
                  </button>
                </>
              )}

            <div>
              {isAuthenticated().user &&
                isAuthenticated().user.role === "admin" && (
                  <div class="card mt-5">
                    <div className="card-body">
                      <h5 className="card-title">Admin</h5>
                      <p className="mb-2 text-danger">
                        Edit/Delete as an Admin
                      </p>
                  
                      <button
                        onClick={this.deleteConfirmed}
                        className="btn btn-raised btn-danger"
                      >
                        Delete Quotation
                      </button>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </>
    );
  };

  render() {
    const { quotation, redirectToHome, redirectToSignin } = this.state;
    console.log(quotation);

    if (redirectToHome) {
      return <Redirect to={`/quotations`} />;
    } else if (redirectToSignin) {
      return <Redirect to={`/signin`} />;
    }

    return (
      <div className="container">
        <h2 className="display-2 mt-5 mb-5">{quotation.title}</h2>

        {!quotation ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderQuotation(quotation)
        )}
      </div>
    );
  }
}

export default SingleQuotation;
