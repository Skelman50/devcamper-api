const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/error-response');

exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find();
    res.status(200).json({ succes: true, data: bootcamps });
  } catch (error) {
    next(error);
  }
};

exports.getBootcamp = async (req, res, next) => {
  try {
    const {
      params: { id }
    } = req;
    const bootcamp = await Bootcamp.findById(id);
    if (!bootcamp) {
      return next(new ErrorResponse('Bootcamp not found', 404));
    }
    res.status(200).json({ succes: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
};

exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ succes: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
};

exports.updateBootcamp = async (req, res, next) => {
  try {
    const {
      body,
      params: { id }
    } = req;
    const bootcamp = await Bootcamp.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true
    });

    if (!bootcamp) {
      return next(new ErrorResponse('Bootcamp not found', 404));
    }
    res.status(200).json({ succes: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
};

exports.deleteBootcamp = async (req, res, next) => {
  try {
    const {
      params: { id }
    } = req;
    const bootcamp = await Bootcamp.findByIdAndDelete(id);
    if (!bootcamp) {
      return next(new ErrorResponse('Bootcamp not found', 404));
    }
    res.status(200).json({ succes: true, data: bootcamp });
  } catch (error) {
    next(error);
  }
};
