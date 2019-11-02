const { getpagination } = require("../services/bootcamps");

exports.advancedResult = (model, populate) => async (req, res, next) => {
  const reqQuery = { ...req.query };
  const removeFields = ["select", "sort", "page", "limit"];
  removeFields.forEach(param => delete reqQuery[param]);
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, math => `$${math}`);
  let query = model.find(JSON.parse(queryStr));
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query.select(fields);
  }

  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query.sort(sortBy);
  } else {
    query.sort("-createdAt");
  }

  const pagination = await getpagination(req, query, model);
  if (populate) {
    query = query.populate(populate);
  }
  const results = await query;

  res.advancedResult = {
    success: true,
    count: results.length,
    pagination,
    data: results
  };
  next();
};
