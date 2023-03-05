const express = require("express");
const routes = express.Router();
const { loginValidation } = require("./validation");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

routes.get("/", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);

    conn.query("SELECT * FROM books", (err, rows) => {
      if (err) return res.send(err);

      res.json(rows);
    });
  });
});

routes.post("/", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query("INSERT INTO books set ?", [req.body], (err, rows) => {
      if (err) return res.send(err);

      res.send("book added!");
    });
  });
});

routes.delete("/:id", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(
      "DELETE FROM books WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        if (err) return res.send(err);

        res.send("book excluded!");
      }
    );
  });
});

routes.put("/:id", (req, res) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(
      "UPDATE books set ? WHERE id = ?",
      [req.body, req.params.id],
      (err, rows) => {
        if (err) return res.send(err);

        res.send("book updated!");
      }
    );
  });
});

// Login

routes.post("/login", loginValidation, (req, res, next) => {
  req.getConnection((err, conn) => {
    if (err) return res.send(err);
    conn.query(
      "SELECT * FROM users WHERE email = ?",
      [req.body.email],
      (err, result) => {
        if (err) return res.send(err);
        if(result.length > 0){
            if(req.body.password === result[0].password){
                res.send('SUCCESS');
            } else {
                res.send('INVALID PASSWORD');
            }
        } else {
            res.send('INVALID EMAIL');
        }
        // if(req.body.password === result[0]['password']){
        //     res.send("Sign in!");
        // } else {
        //     res.send("Wrong password!");
        // }
      }
    );
  });
  // check password
});

routes.post("/register", (req, res) => {
    req.getConnection((err, conn) => {
      if (err) return res.send(err);
      conn.query("INSERT INTO users set ?", [req.body], (err, result) => {
        if (err) return res.send(err);
        console.log(result);
        res.send("user added!");
      });
    });
  });


module.exports = routes;
