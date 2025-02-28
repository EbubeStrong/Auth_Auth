const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const router = require("./routers/auth/auth-routes.js");
const dotenv = require("dotenv"); // ✅ Correct import
dotenv.config(); // ✅ Now it works!

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "*"
    //   [
    //   "http://localhost:5000",
    //   "http://localhost:3000",
    //   "http://localhost:5173",
    //   "https://jayzwillz-react-authentication-app.netlify.app",
    //   "https://circle-22-auth.vercel.app",
    // ]
      ,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

  app.get("/", (req, res) => {
    res.send("Welcome to the Circle-22 Authentication API. Wishing you all the best with the Authentication Process. Just keep grinding and you will get there. ");
  });

app.use("/api/auth", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
