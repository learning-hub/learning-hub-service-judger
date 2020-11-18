// Require the framework and instantiate it
const app = require("fastify")({ logger: true });
const S = require("fluent-schema");
// Run the server!
const bootstap = async () => {
  // app.register(require("./schemas/judge"));

  app.register(require("./routers/judge"));

  app.register(require("./routers/ping"));

  await app.listen(3000);
  app.log.info(`server listening on ${app.server.address().port}`);
};
bootstap().catch((err) => {
  app.log.error(err);
  process.exit(1);
});
