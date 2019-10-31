const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const AppError = require('./app-error');

const OK = 200;
const CREATED = 201;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;

function serve(port, sensors) {
//@TODO set up express app, routing and listen

  const app = express();
  app.locals.port = port;
  //app.locals.base = base;
  app.locals.sensors = sensors;
  setupRoutes(app);
  app.listen(port, function() {
    console.log(`listening on port ${port}`);
  });

}

module.exports = {
  serve: serve
 };

//@TODO routing function, handlers, utility functions

function setupRoutes(app) {
  const base = '/sensor-types';
  const base1 = '/sensors';
  const base2 = '/sensor-data';
  app.use(cors());
  app.use(bodyParser.json());
  //app.get('/', sensor-types(app));

  app.get('/sensor-types', doList(app));
  app.get('/sensors',doList1(app));
  app.get('/sensor-data',doList2(app));
  app.post('/sensor-types', doCreate(app));
  app.post('/sensors',doCreate1(app));
  app.post('/sensor-data',doCreate2(app));
  app.get(`${'/sensor-types'}/:id`, doGet(app));
  app.get(`${'/sensors'}/:id`, doGet1(app));
  app.get(`${'/sensor-data'}/:id`, doGet2(app));

/* app.delete(`${base}/:id`, doDelete(app));
 app.put(`${base}/:id`, doReplace(app));
  app.patch(`${base}/:id`, doUpdate(app)); */
  app.use(doErrors()); //must be last
}


function doList(app) {
  return errorWrap(async function(req, res) {
    const q = req.query || {};
    try {
      const results = await app.locals.sensors.findSensorTypes(q);
results.self = requestUrl(req);
      res.json(results);
    }
    catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function doList1(app) {
  return errorWrap(async function(req, res) {
    const q = req.query || {};
    try {
      const results = await app.locals.sensors.findSensors(q);
results.self = requestUrl(req);
      res.json(results);
    }
    catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function doList2(app) {
  return errorWrap(async function(req, res) {
    const q = req.query || {};
    try {
      const results = await app.locals.sensors.findSensorData(q);
results.self = requestUrl(req);
      res.json(results);
    }
    catch (err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function doCreate(app) {
  return errorWrap(async function(req, res) {
    try {
      const obj = req.body;
      const results = await app.locals.sensors.addSensorType(obj);
      //const results1 = await app.locals.sensors.addSensor(obj);
    //  results.self = requestUrl(req);
    //    results.append('Self', requestUrl(req) );
      res.append('Location', requestUrl(req) + '/' + obj.id);
      res.sendStatus(CREATED);
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function doCreate1(app) {
  return errorWrap(async function(req, res) {
    try {
      const obj = req.body;
      //const results = await app.locals.sensors.addSensorType(obj);
      const results1 = await app.locals.sensors.addSensor(obj);
      //results.self = requestUrl(req);
    //    results1.append('Self', requestUrl(req) );
      res.append('Location', requestUrl(req) + '/' + obj.id);
      res.sendStatus(CREATED);
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}
function doCreate2(app) {
  return errorWrap(async function(req, res) {
    try {
      const obj = req.body;
      //const results = await app.locals.sensors.addSensorType(obj);
      const results1 = await app.locals.sensors.addSensorData(obj);
      //results.self = requestUrl(req);
    //  results1.append('Self', requestUrl(req) );
      res.append('Location', requestUrl(req) + '/' + obj.id);
      res.sendStatus(CREATED);
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}


function doGet(app) {
  return errorWrap(async function(req, res) {
    try {
      const id = req.params.id;
      const results = await app.locals.sensors.findSensorTypes({ id: id });
      if (results.length === 0) {
	throw {
	  isDomain: true,
	  errorCode: 'NOT_FOUND',
	  message: `user ${id} not found`,
	};
      }
      else {
	res.json(results);
      }
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function doGet1(app) {
  return errorWrap(async function(req, res) {
    try {
      const id = req.params.id;
      const results = await app.locals.sensors.findSensors({ id: id });
      if (results.length === 0) {
	throw {
	  isDomain: true,
	  errorCode: 'NOT_FOUND',
	  message: `user ${id} not found`,
	};
      }
      else {
	res.json(results);
      }
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function doGet2(app) {
  return errorWrap(async function(req, res) {
    try {
      const id = req.params.id;
      const results = await app.locals.sensors.findSensorData({ sensorId: id });
      if (results.length === 0) {
	throw {
	  isDomain: true,
	  errorCode: 'NOT_FOUND',
	  message: `user ${id} not found`,
	};
      }
      else {
	res.json(results);
      }
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}


/*function doDelete(app) {
  return errorWrap(async function(req, res) {
    try {
      const id = req.params.id;
      const results = await app.locals.sensors.delete({ id: id });
      res.sendStatus(OK);
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}

function doReplace(app) {
  return errorWrap(async function(req, res) {
    try {
      const replacement = Object.assign({}, req.body);
      replacement.id = req.params.id;
      const results = await app.locals.sensors.replace(replacement);
      res.sendStatus(OK);
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}


function doUpdate(app) {
  return errorWrap(async function(req, res) {
    try {
      const patch = Object.assign({}, req.body);
      patch.id = req.params.id;
      const results = app.locals.sensors.update(patch);
      res.sendStatus(OK);
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
} */


/** Ensures a server error results in nice JSON sent back to client
 *  with details logged on console.
 */
function doErrors(app) {
  return async function(err, req, res, next) {
    res.status(SERVER_ERROR);
    res.json({ code: 'SERVER_ERROR', message: err.message });
    console.error(err);
  };
}

/** Set up error handling for handler by wrapping it in a
 *  try-catch with chaining to error handler on error.
 */
function errorWrap(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    }
    catch (err) {
      next(err);
    }
  };
}
/*************************** Mapping Errors ****************************/

const ERROR_MAP = {
  EXISTS: CONFLICT,
  NOT_FOUND: NOT_FOUND
}

/** Map domain/internal errors into suitable HTTP errors.  Return'd
 *  object will have a "status" property corresponding to HTTP status
 *  code.
 */
function mapError(err) {
  console.error(err);
  return err.isDomain
    ? { status: (ERROR_MAP[err.errorCode] || BAD_REQUEST),
	code: err.errorCode,
	message: err.message
      }
    : { status: SERVER_ERROR,
	code: 'NOT_FOUND',
	message: err.toString()
      };
}

/****************************** Utilities ******************************/

/** Return original URL for req */
function requestUrl(req) {
  const port = req.app.locals.port;
  return `${req.protocol}://${req.hostname}:${port}${req.originalUrl}`;
}
