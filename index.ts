import express from "express";
import cors from "cors";
import usersRouter from "./modules/usersRouter";
import "dotenv/config";
import jwt from "jsonwebtoken";

export const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Welcome to My API");
});

// =========== JSON Web Tokens
app.get("/login", (req, res) => {
  const user = {
    id: Date.now(),
    email: "test@test.com",
    password: "password",
  };
  jwt.sign({ user }, "secret", (err: any, token: any) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ token });
  });
});

const PORT = process.env.PORT || 3000;

export const server = app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}/`);
});

server.on("error", console.error);
