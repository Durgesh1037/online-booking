var express = require("express");
var router = express.Router();

const verify = require("../middleware/verify");

const Booking = require("../models/booking.model");

const { ObjectId } = require("mongodb");

router.post("/", verify, async function (req, res, next) {
  try {
    const username = req.userId;
    const { tripId, status, seatNumber, bookingDateTime, to, from } = req.body;
    const createBooking = new Booking({
      userId: username,
      tripId,
      status,
      seatNumber,
      bookingDateTime,
      to,
      from,
    });
    await createBooking.save();
    return res.status(200).status({
      message: "user booking created",
      status: true,
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).send({ message: "something went wrong", status: false });
  }
});
router.get("/", verify, async function (req, res, next) {
  try {
    const username = req.userId;
    const allBookings = await Booking.find({ username });
    return res.status(200).status({
      message: "all bookings fetched",
      bookings: allBookings,
      status: true,
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).send({ message: "something went wrong", status: false });
  }
});

router.get("/:id", verify, async function (req, res, next) {
  try {
    const username = req.userId;
    const bookingDetails = await Booking.find({
      username,
      _id: new ObjectId(id),
    });
    return res.status(200).status({
      message: "all bookings fetched",
      bookings: bookingDetails,
      status: true,
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).send({ message: "something went wrong", status: false });
  }
});

router.delete("/:id", verify, async function (req, res, next) {
  try {
    const username = req.userId;
    const bookingDetails = await Booking.find({
      username,
      _id: new ObjectId(id),
    });
    const date = new Date(Number(bookingDetails.bookingDateTime)).getTime();
    const currentDateTime = Date.now();
    if (date < currentDateTime) {
      const bookingDeleted = await Booking.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).status({
        message: "your booking deleted",
        status: true,
      });
    }
    return res.status(200).status({
      message:
        "unable to delete booking at this moment , you can delete booking within 24 hrs",
      status: true,
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).send({ message: "something went wrong", status: false });
  }
});

//
// With generate qrcode
const generateQR = async text => {
    try {
      console.log(await QRCode.toDataURL(text))
    } catch (err) {
      console.error(err)
    }
  }

router.get("/:id/ticket", verify, async function (req, res, next) {
  try {
    const username = req.userId;
    const ticketDetails = await Booking.find({
      username,
      _id: new ObjectId(id),
    });

    generateQR();
    return res.status(200).status({
      message: "your booking ticket details fetched",
      ticketDetails,
      status: true,
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).send({ message: "something went wrong", status: false });
  }
});







module.exports = router;

// • POST /bookings User Book a seat (status: PENDING, check seat availability)
// • GET /bookings User View own bookings
// • GET /bookings/:id User Get booking details
// • DELETE /bookings/:id User Cancel booking (only if < 24 hrs since booking)
// • GET /bookings/:id/ticket User Generate the QR code for the ticket and ensure it
// opens in Google to be viewable. (only if status = CONFIRMED)
