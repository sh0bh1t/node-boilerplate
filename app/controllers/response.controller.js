
'use strict';

// Modules
var ErrorNotFound = require('../errors/not_found.error.js');

module.exports = {

  success : function (req, res, next) {

    if (res.locals._view) {

      // Store View Name and Delete
      var view = res.locals._view;
      delete res.locals._view;

      // Send HTML View
      res.render(view, res.locals);

    } else {

      // Send JSON
      res.status(200);
      res.send(res.locals);

    }

  },

  // No Route Found
  // Second to last route (non-error catchall)
  // Do not call next(), just respond
  not_found : function (req, res, next) {
    next(new ErrorNotFound('Resource was not found', req));
  },

  // Always keep this as the last middleware
  // It uses 4 arguments to signify it is an error handler
  failure : function (error, req, res, next) {

    // Default properties
    if (!error.status) { error.status = 500; }
    if (!error.type) { error.type = 'server'; }

    // Compose information sent back
    // We may not want to send everything
    // in the error for security/privacy reasons
    var error_to_send = {
      type    : error.type,
      name    : error.name,
      message : error.message
    };

    // Add data if present
    if (error.data) { error_to_send.data = error.data; }

    // Respond
    // Could also chain: res.status().send()
    res.status(error.status);
    res.send({
      error : error_to_send
    });

    // Do not call next()
    // unless you have a middleware ready
    // to handle this and/or send to a service
    // next(error);

  }

};
