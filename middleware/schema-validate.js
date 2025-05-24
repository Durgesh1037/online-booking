const schemaValidate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    const valid = error == null;
    if (valid) {
      return next();
    }
    const { details } = error;
    const msg = details.map((error) => error.message).join(",");
    res.status(422).send({ message: msg, status: false });
  };
};

module.exports = schemaValidate;
