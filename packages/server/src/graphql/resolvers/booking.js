const Booking = require("../../models/booking");
const Event = require("../../models/event");

module.exports = {
  bookings: async (args, req) => {
    try {
      if (!req.isAuth) {
        throw new Error("Unauthenticated!");
      }

      const bookings = await Booking.find().populate("user").populate("event");
      return bookings.map((booking) => {
        return {
          ...booking._doc,
          createdAt: new Date(booking._doc.createdAt).toISOString(),
          updatedAt: new Date(booking._doc.createdAt).toISOString(),
        };
      });
    } catch (error) {
      throw error;
    }
  },

  bookEvent: async (args, req) => {
    try {
      if(!req.isAuth) {
        throw new Error("Unauthenticated!");
      }

      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        event: fetchedEvent,
        user: req.userId,
      });

      const result = await booking.save();
      const thisBooking = await Booking.findOne({ _id: result._id })
        .populate("user")
        .populate("event");
      return thisBooking;
    } catch (error) {
      throw error;
    }
  },

  cancelBooking: async (args, req) => {
    try {
      if(!req.isAuth) {
        throw new Error("Unauthenticated!");
      }

      const booking = await Booking.findById(args.bookingId).populate("event");
      const event = await Event.findOne({ _id: booking.event._id }).populate(
        "creator"
      );
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (error) {
      throw error;
    }
  },
};
