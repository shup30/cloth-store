import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/Avatar.png";

class ProfileTabs extends Component {
  render() {
    const { posts, quotation } = this.props;
    console.log(this.props);
    return (
      <div>
        <div className="row">
          <div className="col-md-4">
            <h3 className="text-primary">{posts.length} Products</h3>
            <hr />
            {posts.map((post, i) => (
              <div key={i}>
                <div>
                  <Link to={`/product/${post._id}`}>
                    <div>
                      <p className="lead">{post.title}</p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4">
            <h3 className="text-primary">{quotation.length} Quotations</h3>
            <hr />
            {quotation.map((quotation, i) => (
              <div key={i}>
                <div>
                  <Link to={`/quotation/${quotation._id}`}>
                    <div>
                      <p className="lead">{quotation.cmp_name}</p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ProfileTabs;
