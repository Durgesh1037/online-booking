var express = require("express");
var router = express.Router();
const Trip = require("../models/trip.model");
const Booking = require("../models/booking.model");
const schemaValidate = require("../middleware/schema-validate");
const schemas = require("../helper/schemas");
const { ObjectId } = require("mongodb");
const User = require("../models/user.model");

router.post(
  "/trips",
  schemaValidate(schemas.tripPOST),
  async function (req, res) {
    const { tripName, to, from, seats, price } = req.body;
    try {
      const tripData = new Trip({ name: tripName, to, from, seats, price });
      const result = await tripData.save();
      res
        .status(200)
        .send({ message: "trip successfully created", status: true });
    } catch (err) {
      console.log("err", err);
      res.status(500).send({ message: "something went wrong", status: false });
    }
  }
);

router.put(
  "/trips/:id",
  schemaValidate(schemas.tripPOST),
  async function (req, res) {
    const { tripName, to, from, seats, price } = req.body;
    const { id } = req.params;
    try {
      const tripUpdated = await Trip.updateOne(
        { _id: new ObjectId(id) },
        { $set: { name: tripName, to, from, seats, price } }
      );

      res
        .status(200)
        .send({ message: "trip successfully updated", status: true });
    } catch (err) {
      console.log("err", err);
      res.status(500).send({ message: "something went wrong", status: false });
    }
  }
);

router.delete("/trips/:id", async function (req, res) {
  const { id } = req.params;
  try {
    const tripDeleted = await Trip.deleteOne({ _id: new ObjectId(id) });

    res
      .status(200)
      .send({ message: "trip successfully deleted", status: true });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ message: "something went wrong", status: false });
  }
});

router.get("/trips/:id", async function (req, res) {
  const { id } = req.params;
  try {
    const tripData = await Trip.find({ _id: new ObjectId(id) });

    res.status(200).send({
      message: "trip successfully fetched by id",
      trip: tripData,
      status: true,
    });
  } catch (err) {
    res.status(500).send({ message: "something went wrong", status: false });
  }
});

router.get("/trips", async function (req, res) {
  const { city } = req.query;
  try {
    if (city) {
      const tripData = await Trip.aggregate([
        {
          $project: {
            to: 1,
            isCity: { $eq: ["$to", city] },
          },
        },
      ]);
      return res.status(200).send({
        message: "trip successfully fetched by city",
        trip: tripData,
        status: true,
      });
    }
    const tripData = await Trip.find();
    res.status(200).send({
      message: "All trips successfully fetched",
      trip: tripData,
      status: true,
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ message: "something went wrong", status: false });
  }
});

router.get("/users", async function (req, res) {
  try {
    const allUsers = await User.find({ role: "User" });
    res.status(200).send({
      message: "all users fetched",
      users: allUsers,
      status: true,
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ message: "something went wrong", status: false });
  }
});

router.get("/bookings", async function (req, res) {
  const { status } = req.query;
  try {
    if (status) {
      const allBookingsByStatus = await Booking.aggregate([
        {
          $project: {
            status: 1,
            tripName: 1,
            isStatus: { $eq: ["$status", status] },
          },
        },
      ]);
      return res.status(200).send({
        message: "all bookings successfully fetched by status",
        booking: allBookingsByStatus,
        status: true,
      });
    }

    const allBookingsByStatus = await Booking.find();
    return res.status(200).send({
      message: "all bookings successfully fetched",
      booking: allBookingsByStatus,
      status: true,
    });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ message: "something went wrong", status: false });
  }
});

router.put("/bookings/:id", async function (req, res) {
  const { id } = req.params;
  const { status } = req.body;
  try {
      const bookingUpdated = await Booking.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
      );
      return res.status(200).send({
        message: "Booking updated successfully",
        booking: bookingUpdated,
        status: true,
      });
  } catch (err) {
    console.log("err", err);
    res.status(500).send({ message: "something went wrong", status: false });
  }
});

module.exports = router;

// • POST /trips Admin Create a new trip
// • PUT /trips/:id Admin Update trip info
// • DELETE /trips/:id Admin Delete a trip
// • GET /trips Public Search all trips (filter by date, city)
// • GET /trips/:id Public Get trip details
