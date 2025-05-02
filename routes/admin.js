var express = require("express");
var router = express.Router();
const Trip = require("../models/trip.model");
const Booking = require("../models/booking.model");

const { ObjectId } = require("mongodb");

router.post("/trips", async function (req, res) {
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
});

router.put("/trips/:id", async function (req, res) {
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
});

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
    console.log("err", err);
    res.status(500).send({ message: "something went wrong", status: false });
  }
});

router.get("/trips", async function (req, res) {
  const { city } = req.query;
  try {
    const tripData = await Trip.find({ to: city });

    res.status(200).send({
      message: "trip successfully fetched by id",
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
    const allUsers = await Trip.find({ role: "User" });

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
  const { filterValue } = req.query;

  try {
    if (filterValue) {
      const allBookingsByStatus = await Booking.find({ status: filterValue });
      return res.status(200).send({
        message: "all users fetched",
        booking: allBookingsByStatus,
        status: true,
      });
    }

    const allBookingsByStatus = await Booking.find();
    return res.status(200).send({
      message: "all users fetched",
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

  const { status } = req.query;

  try {
    if (filterValue) {
      const bookingUpdated = await Booking.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status } }
      );
      return res.status(200).send({
        message: "Booking updated",
        booking: allBookingsByStatus,
        status: true,
      });
    }

    const allBookingsByStatus = await Booking.find();
    return res.status(200).send({
      message: "all users fetched",
      booking: allBookingsByStatus,
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
