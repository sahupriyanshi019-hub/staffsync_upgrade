// wraps async handlers so errors reach the express error handler
module.exports = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
