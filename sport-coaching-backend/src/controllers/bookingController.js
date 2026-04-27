const bookingService = require("../services/bookingService");

const bookingController = {
  async create(req, res, next) {
    try {
      const result = await bookingService.createBooking(req.user, Number(req.params.sessionId));
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
  async cancel(req, res, next) {
    try {
      await bookingService.cancelBooking(req.user, Number(req.params.sessionId));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
  async listMine(req, res, next) {
    try {

      const result = await bookingService.listMyBookings(req.user);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = bookingController;
