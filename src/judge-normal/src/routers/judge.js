const S = require("fluent-schema");

const singleBodySchema = S.object()
  .prop("options", S.array().items(S.string()).required())
  .prop("answer", S.string().required())
  .prop("input", S.string().required());

const multiBodySchema = S.object()
  .prop("options", S.array().items(S.string()).required())
  .prop("answers", S.array().items(S.string()).required())
  .prop("input", S.string().required());

const fillBodySchema = S.object()
  .prop("keywords", S.array().items(S.string()).required())
  .prop("nokeywords", S.array().items(S.string()).required())
  .prop("input", S.string().required());

module.exports = function (app, opts, done) {
  app.post(
    "/judge/single",
    {
      schema: {
        body: singleBodySchema,
      },
    },
    async function (req, rep) {
      return {
        result: req.body.input === req.body.answer,
      };
    }
  );

  app.post(
    "/judge/multi",
    {
      schema: {
        body: multiBodySchema,
      },
    },
    async function (req, rep) {
      return {
        result: req.body.input.split(),
      };
    }
  );

  app.post(
    "/judge/fill",
    {
      schema: {
        body: fillBodySchema,
      },
    },
    async function (req, rep) {
      return {
        result: 1,
      };
    }
  );
  done();
};
