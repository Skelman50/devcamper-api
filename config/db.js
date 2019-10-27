const mongoose = require('mongoose');

const connectToDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

  console.log(`Mongo connected ${conn.connection.host}`);
};

module.exports = { connectToDB };
