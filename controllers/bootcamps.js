const path = require("path");
const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/error-response");
const asyncHandler = require("express-async-handler");
const { geocoder } = require("../utils/geocoder");

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResult);
});

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const {
    params: { id }
  } = req;
  const bootcamp = await Bootcamp.findById(id).populate("courses");
  if (!bootcamp) {
    return next(new ErrorResponse("Bootcamp not found", 404));
  }
  res.status(200).json({ succes: true, data: bootcamp });
});

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({ succes: true, data: bootcamp });
});

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const {
    body,
    params: { id }
  } = req;
  const bootcamp = await Bootcamp.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  });

  if (!bootcamp) {
    return next(new ErrorResponse("Bootcamp not found", 404));
  }
  res.status(200).json({ succes: true, data: bootcamp });
});

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const {
    params: { id }
  } = req;
  const bootcamp = await Bootcamp.findById(id);
  if (!bootcamp) {
    return next(new ErrorResponse("Bootcamp not found", 404));
  }
  bootcamp.remove();
  res.status(200).json({ succes: true });
});

exports.getBootcampsInradius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  const loc = await geocoder.geocode(zipcode);
  const [{ latitude, longitude }] = loc;

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
  });

  res.json({ succes: true, data: bootcamps });
});

//photo upload
//put api/v1/bootcamps/:id/photo

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(new ErrorResponse("Bootcamp not found", 404));
  }
  if (!req.files) {
    return next(new ErrorResponse("Please upload a photo", 400));
  }
  const { file } = req.files;

  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse("Please upload a photo", 400));
  }
  //check file size
  if (file.size > process.env.MAX_FILE_UPLOADS) {
    return next(
      new ErrorResponse(
        `please upload a image less then ${process.env.MAX_FILE_UPLOADS}`,
        400
      )
    );
  }

  //create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse("Problem with file upload", 500));
    }
    await Bootcamp.updateOne({ _id: bootcamp._id }, { photo: file.name });
    res.json({ success: true, data: file.name });
  });
});
