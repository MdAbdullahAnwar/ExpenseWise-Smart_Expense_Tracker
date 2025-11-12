const validate = (schema) => {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error.issues && error.issues.length > 0) {
        return res.status(400).json({ message: error.issues[0].message });
      }
      return res.status(400).json({ message: "Validation failed" });
    }
  };
};

module.exports = validate;
