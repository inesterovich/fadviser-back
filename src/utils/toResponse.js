module.exports = function toResponse () {
  const { _id, ...rest } = this.toJSON();
  delete rest.password;
  delete rest.userSecret;
  delete rest.__v;

  return {
    _id,
    ...rest,
  };
};
