/*
 * Copyright (c) Microsoft. All rights reserved. Licensed under the MIT license. See full license in root of repo. -->
 *
 * This file defines the routes within the authRoute router.
 */

var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
var form = require('form-urlencoded').default;


/* GET users listing. */
router.get('/', async function(req, res, next) {
  const authorization = req.get('Authorization');
  if (authorization == null) {
     let error = new Error('No Authorization header was found.');
     next(error);
  } 
  else {
    const [schema, jwt] = authorization.split(' ');
    const formParams = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
      requested_token_use: 'on_behalf_of',
      scope: ['Files.Read.All'].join(' ')
    };

    const stsDomain = 'https://login.microsoftonline.com';
    const tenant = 'common';
    const tokenURLSegment = 'oauth2/v2.0/token';

    try {
      const tokenResponse = await fetch(`${stsDomain}/${tenant}/${tokenURLSegment}`, {
        method: 'POST',
        body: form(formParams),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      const json = await tokenResponse.json();
    
      res.send(json);
    }
    catch(error) {
      res.status(500).send(error);
    }
  }

  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
});

module.exports = router;
