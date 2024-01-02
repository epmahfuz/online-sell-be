function logRequest(customMessage) {
    return function (req, res, next) {
        console.log(customMessage);
      next();
    };
  }
  
  module.exports = logRequest;