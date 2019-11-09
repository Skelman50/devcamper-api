const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const cors = require("cors");
require("colors");

const { connectToDB } = require("./config/db");

dotenv.config({ path: "./config/config.env" });

const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const auth = require("./routes/auth");
const users = require("./routes/users");
const reviews = require("./routes/reviews");
const { errorHandler } = require("./middleware/error");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(xss());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
});

app.use(limiter);

//prevent http param polution
app.use(hpp());

app.use(cors());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(fileUpload());
app.use(mongoSanitize());
app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectToDB();
  app.listen(
    PORT,
    console.log(
      `App listening on port ${PORT} and node env=${process.env.NODE_ENV}!`
    )
  );
};

startServer();
