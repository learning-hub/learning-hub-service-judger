const os = require("os");

module.exports = function (app, opts, done) {
  app.get("/ping", async function (req, rep) {
    console.log(process);
    return {
      judger_version: "1.0.0",
      hostname: process.hostname, // 同时也是ID
      // number of cpu cores, this value will determine the number of concurrent tasks
      cpu_core: os.cpus().length,
      // usage of cpu and memory
      cpu: process.cpuUsage().user / 1000,
      memory: process.memoryUsage().rss / 1024 / 1024,
      action: "pong",
    };
  });
  done();
};
