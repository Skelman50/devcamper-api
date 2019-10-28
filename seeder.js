const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });
const Bootcamp = require("./models/Bootcamp");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

const importdata = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log("Data imported".green.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

const deletedata = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log("Data destroyed".red.inverse);
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

if (process.argv[2] === "-i") {
  importdata();
} else if (process.argv[2] === "-d") {
  deletedata();
}
