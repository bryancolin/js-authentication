const Event = require("../../models/event");
const User = require("../../models/user");

module.exports = {
  events: async () => {
    try {
      const events = await Event.find().populate("creator");
      return events;
    } catch (error) {
      throw error;
    }
  },

  createEvent: async (args, req) => {
    if(!req.isAuth) {
      throw new Error("Unauthenticated!");
    }
    
    const event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date().toISOString(),
      creator: req.userId,
    });

    try {
      const result = await event.save();
      const creator = await User.findById(req.userId);

      if (!creator) {
        throw new Error("User not found.");
      }
      creator.createdEvents.push(event);
      await creator.save();

      return result;
    } catch (error) {
      throw error;
    }
  },
};
