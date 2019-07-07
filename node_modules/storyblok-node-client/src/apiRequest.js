'use strict';

const url = require('url');
const request = require('request');

module.exports = (requestUrl) =>
  new Promise((resolve, reject) =>
    request.get(url.format(requestUrl), (error, response) => {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    })
);
