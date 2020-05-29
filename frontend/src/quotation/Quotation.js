import React, { Component } from "react";
import { list } from "./apiQuotation";
import DefaultProduct from "../images/prod.png";
import { Link } from "react-router-dom";

class Quotation extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      page: 1,
    };
  }

  loadPosts = (page) => {
    list(page).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
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

  renderPosts = (posts) => {
    console.log(posts);
    return (
      <div className="row">
        {posts.map((post, i) => {
          const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
          const posterName = post.postedBy ? post.postedBy.name : " Unknown";
          const date = new Date(post.created);

          return (
            <div className="card col-md-4" key={i}>
              <div className="card-body">
                <h1 className="card-title"> Company Name: {post.cmp_name}</h1>
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">Issued To: {post.issued_to}</p>
                <p className="card-text">
                  Issued Date: {date.toLocaleDateString()}
                </p>

                <br />
                <p className="font-italic">
                  Issued by: {post.issuer_name}
                </p>
                <Link
                  to={`/quotation/${post._id}`}
                  className="btn btn-raised btn-primary btn-sm"
                >
                  View Quotation
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { posts, page } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">
          {!posts.length ? "No more Quotations!" : "Recent Quotations"}
          <br/> <br/>
          <Link to="/quotation/create" className="btn btn-raised btn-info btn-sm">
            Create new Quotation
          </Link>
        </h2>

        {this.renderPosts(posts)}
        <div className="columns">
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

        {posts.length ? (
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
      </div>
    );
  }
}

export default Quotation;
