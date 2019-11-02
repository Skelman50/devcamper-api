const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
require("colors");

const { connectToDB } = require("./config/db");

dotenv.config({ path: "./config/config.env" });

const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");
const { errorHandler } = require("./middleware/error");

const app = express();

app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(fileUpload());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

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
