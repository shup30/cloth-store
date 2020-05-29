import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./core/Home";
import Menu from "./core/Menu";
import Profile from "./user/Profile";
import EditProfile from "./user/EditProfile";
import Material from "./core/Material";
import PrivateRoute from "./auth/PrivateRoute";
import NewProduct from "./product/NewProduct";
import EditProduct from "./product/EditProduct";
import SingleProduct from "./product/SingleProduct";

import Quotation from "./quotation/Quotation";
import NewQuotation from "./quotation/NewQuotation";
import SingleQuotation from "./quotation/SingleQuotation";

import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Admin from "./admin/Admin";

const MainRouter = () => (
  <div>
    <Menu />
    <Switch>
      <Route exact path="/" component={Home} />
      <PrivateRoute exact path="/admin" component={Admin} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/signin" component={Signin} />

      <PrivateRoute exact path="/product/create" component={NewProduct} />
      <Route exact path="/product/:productId" component={SingleProduct} />
      <PrivateRoute exact path="/product/edit/:productId" component={EditProduct} />
      <Route exact path="/materials" component={Material} />

      <Route exact path="/quotations" component={Quotation} />
      <PrivateRoute exact path="/quotation/create" component={NewQuotation} />
      <Route exact path="/quotation/:quotationId" component={SingleQuotation} />

      <Route exact path="/materials" component={Material} />
      <PrivateRoute exact path="/user/:userId" component={Profile} />
      <PrivateRoute exact path="/user/edit/:userId" component={EditProfile} />
    </Switch>
  </div>
);

export default MainRouter;
