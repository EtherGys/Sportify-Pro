const logInfo = (message, context = {}) => {
  console.info(message, context);
};

const logError = (message, context = {}) => {
  console.error(message, context);
};

module.exports = { logInfo, logError };
