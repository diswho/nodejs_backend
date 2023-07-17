import * as express from "express";
import db from "../sqlitedb/db";
import jwt from "jsonwebtoken";
import { InfoRequest, InfoResponse } from "./definitionfile";

const usersRouter = express.Router();

// =========== Get Profile
usersRouter.get(
  "/profile",
  verifyToken,
  (req: InfoRequest, res: InfoResponse) => {
    jwt.verify(req.token, "secretkey", (err: any, authData: any) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
      });
    });
    res.json({ message: "success" });
  }
);

// =========== Verify
function verifyToken(
  req: InfoRequest,
  res: InfoResponse,
  next: express.NextFunction
) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(400).json({ error: "can't get token" });
  }
}

// =========== Get All Users
usersRouter.get("/", (req, res) => {
  const getQuery = "SELECT * FROM users";
  db.all(getQuery, (err: any, rows: any) => {
    console.log(rows);
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// =========== Post new user:
usersRouter.post("/", (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
  };
  console.log(data);
  const sql = "INSERT INTO users (name, email) VALUES (?,?)";
  const params = [data.name, data.email];
  db.run(sql, params, (err: any, result: any) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: "success" });
  });
});

// =========== Get single user
usersRouter.get("/user", (req, res) => {
  const id = req.body.userId;
  console.log("id", id);
  const getQuery = "SELECT * FROM users WHERE id=?";
  const params = [id];
  db.get(getQuery, params, (err: any, row: any) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (typeof row === "undefined") {
      res.status(400).send({
        message: "User NotFound",
      });
      return;
    }
    res.json({ message: "success", data: row });
  });
});

// =========== Delete user
usersRouter.delete("/", (req, res) => {
  const data = {
    id: req.body.userId,
  };
  console.log(data);
  const getQuery = "SELECT * FROM users WHERE id=?";
  const params = [data.id];
  db.get(getQuery, params, (err: any, row: any) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (typeof row === "undefined") {
      res.status(400).send({
        message: "User NotFound",
      });
      return;
    }
    const sql = "DELETE FROM users WHERE id=?";
    const params1 = [data.id];
    db.run(sql, params1, (err: any, result: any) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
      });
    });
  });
});

// =========== Update user
export default usersRouter;
usersRouter.put("/", (req, res) => {
  const data = {
    id: req.body.userId,
    name: req.body.name,
    email: req.body.email,
  };
  console.log(data);
  const sql = "UPDATE users SET name=?,email=? WHERE id=?";
  const params = [data.name, data.email, data.id];
  db.run(sql, params, (err: any, result: any) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
    });
  });
});
