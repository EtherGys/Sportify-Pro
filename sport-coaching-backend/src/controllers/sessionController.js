const sessionService = require("../services/sessionService");

const sessionController = {
  async create(req, res, next) {
    try {
      const session = await sessionService.createSession(req.user, req.body);
      res.status(201).json(session);
    } catch (error) {
      next(error);
    }
  },
  async list(req, res, next) {
    try {
      const result = await sessionService.listSessions(req.query);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  async update(req, res, next) {
    try {
      const result = await sessionService.updateSession(req.user, Number(req.params.id), req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  async remove(req, res, next) {
    try {
      await sessionService.deleteSession(req.user, Number(req.params.id));
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
  async participants(req, res, next) {
    try {
      const participants = await sessionService.listSessionParticipants(req.user, Number(req.params.id));
      res.status(200).json(participants);
    } catch (error) {
      next(error);
    }
  },
  async assignCoach(req, res, next) {
    try {
      const result = await sessionService.assignCoach(Number(req.params.id), req.body.coachId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
    async listMine(req, res, next) {
    try {
      
      const result = await sessionService.listMySessions(req.user.coach.id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = sessionController;
