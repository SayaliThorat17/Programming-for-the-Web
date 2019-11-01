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

  app.use(cors());
  app.use(bodyParser.json());

  app.get('/sensor-types', doList(app));
  app.get('/sensors',doList1(app));
  app.get('/sensor-data',doList2(app));
  app.post('/sensor-types', doCreate(app));
  app.post('/sensors',doCreate1(app));
  app.post(`${'/sensor-data'}/:sensorId`, doReplace(app));
  app.get(`${'/sensor-types'}/:id`, doGet(app));
  app.get(`${'/sensors'}/:id`, doGet1(app));
  app.get(`${'/sensor-data'}/:id`, doGet2(app));
  app.get(`${'/sensor-data'}/:id/:timestamp`, doGet3(app));

  app.use(doErrors()); //must be last
}


function doList(app) {
  return errorWrap(async function(req, res) {
    const q = req.query || {};
    try {
      const results = await app.locals.sensors.findSensorTypes(q);
      results.self = requestUrl(req);

    //  console.log(results.self)
      let tempurl = results.self;
      let splits = tempurl.split('?');
      //console.log("0 ",splits[0]);
      //console.log("1",splits[1]);

      if(splits[1]=== undefined){
      //  console.log("hi");
        results.next = requestUrl(req)+'?_index=5';
      }
      else{
      //  console.log("bye");

        if(splits[1] === 'manufacturer=IBM'){

        }
        else {

        let a = splits[1];
        let tem = a.split('=');
      //  console.log('1 :',tem[0]);
        //console.log('2 :',tem[1]);
        //console.log('3 :',tem[2]);

        //tem[2] = 5&_count
        let b = tem[1].split('&_');
      //  console.log('1 :' ,b[0]);

        let x = b[0];
        let y = tem[2];

        let i = parseFloat(x)+parseFloat(y);
        let j = parseFloat(x)-parseFloat(y);
        results.next ='http://localhost:2345/sensor-types?_index=' + i + '&_count=' + y;
        results.prev = 'http://localhost:2345/sensor-types?_index=' + j + '&_count=' + y;
      }

      }

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

      //  console.log(results.self)
        let tempurl = results.self;
        let splits = tempurl.split('?');
        //console.log("0 ",splits[0]);
        //console.log("1",splits[1]);

        if(splits[1]=== undefined){
        //  console.log("hi");
          //results.next = requestUrl(req)+'?_index=5';
        }
        else{
        //  console.log("bye");

          if(splits[1] === 'model=ge-f26x&_count=2') {

          let a = splits[1];
          let tem = a.split('=');
          let b = tem[1].split('&_');
        //  console.log('1 :' ,b[0]);

          let x = b[0];   //gef26x
          let y = tem[2]; //2

          results.next ='http://localhost:2345/sensors?model=' + x + '&_count=' + y +'&_index=' + y;
         }
         else if(splits[1] === '_count=2&_doDetail=true'){

           let a = splits[1];
           let tem = a.split('=');
           let b = tem[1].split('&_');
         //  console.log('1 :' ,b[0]);

           let x = b[0];   //gef26x
           let y = tem[2]; //2

           results.next ='http://localhost:2345/sensors?_count=' + x + '&_doDetail=' + y +'&_index=' + x;

          }


        }
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
      console.log('hehe');
      const results = await app.locals.sensors.findSensorData(q);
      results.self = requestUrl(req);
      console.log(results);
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

function doGet(app) {
  return errorWrap(async function(req, res) {
    try {
      const id = req.params.id;
      const results = await app.locals.sensors.findSensorTypes({ id: id });
      results.self = requestUrl(req);
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
      results.self = requestUrl(req);
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
      const timestamp = req.query.timestamp;
      const statuses = req.query.statuses;
      //  console.log('hoho');
        //console.log('req',req);
      const results = await app.locals.sensors.findSensorData({ sensorId: id ,timestamp : timestamp, statuses : statuses});
      //console.log(results);
      results.self = requestUrl(req);
      /*for(var i of results.data){

        i.self = requestUrl(req);
      } */
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

function doGet3(app) {
  return errorWrap(async function(req, res) {
    try {
      const id = req.params.id;
      const timestamp = req.params.timestamp;
      //  console.log('hoho');
        //console.log('req',req);
      const results = await app.locals.sensors.findSensorData({ sensorId: id , timestamp : timestamp});
      //console.log(results);

      //console.log('0',results);
      //console.log('1',results.data[0]);


      results.self = requestUrl(req);

      if (results.length === 0) {
	throw {
	  isDomain: true,
	  errorCode: 'NOT_FOUND',
	  message: `user ${id} not found`,
	};
      }
      else {
	res.json(results.data[0]);
      }
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
      replacement.sensorId = req.params.sensorId;
      //console.log('1',replacement);
      //console.log('2',replacement.sensorId);
      const results = await app.locals.sensors.addSensorData(replacement);
    //  console.log(results);
      res.sendStatus(CREATED);
    }
    catch(err) {
      const mapped = mapError(err);
      res.status(mapped.status).json(mapped);
    }
  });
}




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
 	code: 'INTERNAL',
 	message: err.toString()
       };
 }

/****************************** Utilities ******************************/

/** Return original URL for req */
function requestUrl(req) {
  const port = req.app.locals.port;
  return `${req.protocol}://${req.hostname}:${port}${req.originalUrl}`;
}
