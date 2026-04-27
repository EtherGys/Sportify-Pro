const AppError = require("../utils/AppError");

const validate = (schema, target = "body") => (req, res, next) => {
  const result = schema.safeParse(req[target]);
  if (!result.success) {
    return next(
      new AppError("Validation failed", 400, {
        errors: result.error.issues.map((issue) => issue.message)
      })
    );
  }
  req[target] = result.data;
  return next();
};

module.exports = validate;
