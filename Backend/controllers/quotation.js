const Quotation = require("../Models/quotation");
const formidable = require("formidable");
const fs = require("fs");
const _ = require("lodash");

exports.quotationById = (req, res, next, id) => {
  Quotation.findById(id)
    .populate("postedBy", "_id name role")
    .exec((err, quotation) => {
      if (err || !quotation) {
        return res.status(400).json({
          error: err,
        });
      }
      req.quotation = quotation;
      next();
    });
};

/*
exports.getPosts = (req, res) => {
    const posts = Post.find()
        .populate("postedBy", "_id name")
        .populate("comments", "text created")
        .populate("comments.postedBy", "_id name")
        .select("_id title body created likes")
        .sort({ created: -1 })
        .then(posts => {
            res.json(posts);
        })
        .catch(err => console.log(err));
};
*/
// with pagination
exports.getQuotations = async (req, res) => {
  // get current page from req.query or use default value of 1
  const currentPage = req.query.page || 1;
  // return 3 posts per page
  const perPage = 6;
  let totalItems;

  const quotation = await Quotation.find()
    // countDocuments() gives you total count of posts
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Quotation.find()
        .skip((currentPage - 1) * perPage)
        .populate("postedBy", "_id name")
        .select(
          "title cmp_name issuer_name issued_to details created item description qty price total"
        )
        .limit(perPage)
        .sort({ created: -1 });
    })
    .then((quotation) => {
      res.status(200).json(quotation);
    })
    .catch((err) => console.log(err));
};

exports.createQuotation = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    let quotation = new Quotation(fields);

    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    quotation.postedBy = req.profile;

    if (files.photo) {
      quotation.photo.data = fs.readFileSync(files.photo.path);
      quotation.photo.contentType = files.photo.type;
    }
    quotation.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(result);
    });
  });
};

exports.quotationByUser = (req, res) => {
  Quotation.find({ postedBy: req.profile._id })
    .populate("postedBy", "_id name")
    .select("title cmp_name issuer_name issued_to details created item description qty price total")
    .sort("_created")
    .exec((err, quotation) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(quotation);
    });
};

exports.isPoster = (req, res, next) => {
  let sameUser =
    req.quotation && req.auth && req.quotation.postedBy._id == req.auth._id;
  let adminUser = req.quotation && req.auth && req.auth.role === "admin";

  console.log("req.post ", req.quotation, " req.auth ", req.auth);
  console.log("SAMEUSER: ", sameUser, " ADMINUSER: ", adminUser);

  let isPoster = sameUser || adminUser;

  if (!isPoster) {
    return res.status(403).json({
      error: "User is not authorized",
    });
  }
  next();
};

// exports.updatePost = (req, res, next) => {
//     let post = req.post;
//     post = _.extend(post, req.body);
//     post.updated = Date.now();
//     post.save(err => {
//         if (err) {
//             return res.status(400).json({
//                 error: err
//             });
//         }
//         res.json(post);
//     });
// };

exports.updateQuotation = (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Photo could not be uploaded",
      });
    }
    // save post
    let quotation = req.quotation;
    quotation = _.extend(quotation, fields);

    if (files.photo) {
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    quotation.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(quotation);
    });
  });
};

exports.deleteQuotation = (req, res) => {
  let quotation = req.quotation;
  console.log("qt:", quotation);
  quotation.remove((err, quotation) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({
      message: "Quotation deleted successfully",
    });
  });
};

// exports.photo = (req, res, next) => {
//     res.set('Content-Type', req.post.photo.contentType);
//     return res.send(req.post.photo.data);
// };

exports.singleQuotation = (req, res) => {
  return res.json(req.quotation);
};
