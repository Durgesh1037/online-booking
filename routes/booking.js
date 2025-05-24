var express = require("express");
var router = express.Router();
const verify = require("../middleware/verify");
const Booking = require("../models/booking.model");
const schemaValidate = require("../middleware/schema-validate");
const schemas = require("../helper/schemas");
const { ObjectId } = require("mongodb");
const QRCode=require("qrcode")

router.post(
  "/",
  verify,
  schemaValidate(schemas.bookingPost),
  async function (req, res) {
    try {
      const username = req.userId;
      console.log("username",username);
      const { tripId, status, seatNumber, bookingDateTime, to, from,tripName } =
        req.body;
      const createBooking = new Booking({
        userId: username,
        tripId,
        status,
        seatNumber,
        bookingDateTime,
        to,
        from,
        name:tripName
      });
      await createBooking.save();
      return res.status(200).send({
        message: "user booking created",
        status: true,
      });
    } catch (err) {
      console.log("error", err);
      res.status(500).send({ message: "something went wrong", status: false });
    }
  }
);
router.get("/", verify, async function (req, res, next) {
  try {
    const username = req.userId;
    const allBookings = await Booking.find({ userId:username });
    return res.status(200).send({
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
    const {id}=req.params;
    const bookingDetails = await Booking.find({
      userId:username,
      _id: new ObjectId(id),
    });
    return res.status(200).send({
      message: "specific booking details successfully fetched",
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
    const id=req.params;
    const bookingDetails = await Booking.find({
      username,
      _id: new ObjectId(id),
    });
    const date = new Date(Number(bookingDetails.bookingDateTime)).getTime();
    const currentDateTime = Date.now();
    if (date < currentDateTime) {
      const bookingDeleted = await Booking.deleteOne({ _id: new ObjectId(id) });
      return res.status(200).send({
        message: "your booking deleted",
        status: true,
      });
    }
    return res.status(200).send({
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
const generateQR = async (textData) => {
  try {
    // console.log(await QRCode.toDataURL(text));
    const text=await QRCode.toDataURL(textData);
    return text;
  } catch (err) {
    console.error(err);
  }
};

router.get("/:id/ticket",verify, async function (req, res, next) {
  try {
    const username = req.userId;
    const {id}=req.params;
    const ticketDetails = await Booking.find({
      userId:username,
      _id: new ObjectId(id),
    });

    console.log(ticketDetails);

    const result=await generateQR(ticketDetails);
    return res.send(`
      <p>QR Code for: <strong>data</strong></p>
      <img src="${result}">
      <br><a href="/">Generate another</a>
    `);
    return res.render('qrcode',{text:result})
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
