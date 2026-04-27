const app = require("./app");
const prisma = require("./config/db");
const env = require("./config/env");
const { logInfo, logError } = require("./utils/logger");

async function bootstrap() {
  try {
    await prisma.$connect();
    app.listen(env.port, () => {
      logInfo(`Server running on port ${env.port}`);
    });
  } catch (error) {
    logError("Failed to start server", { error: error.message });
    process.exit(1);
  }
}

bootstrap();
