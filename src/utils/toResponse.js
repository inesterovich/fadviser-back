module.exports = function toResponse(object) {
  const { _id, ...rest } = object;
  delete rest.password;
  delete rest.userSecret;
  delete rest.__v;

  return {
    _id,
    ...rest,
  };
};
