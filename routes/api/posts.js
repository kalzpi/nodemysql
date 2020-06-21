const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const db = require("../../config/db");

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get("/", [], (req, res) => {
  try {
    let sql = "SELECT * FROM posts";
    db.query(sql, (err, results) => {
      if (err) {
        res.send(err.sqlMessage);
        throw err;
      }
      console.log(results);
      res.json(results);
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/posts
// @desc    Create new post
// @access  Public
router.post(
  "/",
  [
    check("title", "Title is required.").not().isEmpty(),
    check("body", "Body is required.").not().isEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let post = { title: req.body.title, body: req.body.body };
      let sql = "INSERT INTO posts SET ?";
      db.query(sql, post, (err, rows) => {
        if (err) {
          res.send(err.sqlMessage);
        }

        sql = `SELECT * FROM posts WHERE id = ${rows.insertId}`;
        db.query(sql, (err, result) => {
          if (err) {
            res.send(err.sqlMessage);
          }
          res.send(result);
        });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
