'use strict';

const assert = require('assert');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const querystring = require('querystring');

const Mustache = require('mustache');
const widgetView = require('./widget-view');

const STATIC_DIR = 'statics';
const TEMPLATES_DIR = 'templates';

function serve(port, model,base='') {
  const app = express();
  app.locals.port = port;
  app.locals.base = base;
  app.locals.model = model;
  process.chdir(__dirname);
  app.use(base, express.static(STATIC_DIR));
  setupTemplates(app);
  setupRoutes(app);
  app.listen(port, function() {
    console.log(`listening on port ${port}`);
  });
}


module.exports = serve;

//@TODO
function setupRoutes(app) {
  const base = app.locals.base;
  app.get(`${base}/tst-sensor-types-add.html`, createUserForm(app));
  app.post(`${base}/tst-sensor-types-add.html`, bodyParser.urlencoded({extended: false}),
	   createUpdateUser(app));
  app.get(`${base}/tst-sensor-types-search.html`, doSearch(app));
  app.get(`${base}/tst-sensors-add.html`, addSensors(app));
  app.post(`${base}/tst-sensors-add.html`, bodyParser.urlencoded({extended: false}),
	   createUpdateUserSensors(app));
  app.get(`${base}/tst-sensors-search.html`, SearchSensors(app));

}

const FIELDS_INFO = {
  id: {
    friendlyName: 'Sensor Type ID',
    isSearch: true,
    //isId: true,
    isRequired: true,
    isSelectBox: false,
    isLimits: false,
    isDisplay: true,
    regex: /^[-\w]+$/,
    error: 'Sensor Type ID field can only contain alphanumerics, - or _ characters',
  },

  modelNumber: {
    friendlyName: 'Model Number',
    isSearch: true,
    //isId: true,
    isRequired: true,
    isSelectBox: false,
    isLimits: false,
    isDisplay: true,
    regex: /^[-'a-zA-Z0-9\s]+$/,
    error: 'Model Number field can only contain -, space or alphanumeric characters',
  },

  manufacturer: {
    friendlyName: 'Manufacturer',
    isSearch: true,
    //isId: true,
    isRequired: true,
    isSelectBox: false,
    isLimits: false,
    isDisplay: true,
    regex: /^[a-zA-Z '-]+$/,
    error: 'Manufacturer field can only contain -, space or alphabetic characters',
  },

  quantity: {
    friendlyName: 'Measure',
    isSearch: true,
    //isId: true,
    isRequired: true,
    isSelectBox: true,
    isLimits: false,
    isDisplay: true,
    regex: /^\w+$/,
    error: 'Measure field can only contain temperature, pressure, flow or humidity',
  },


  min: {
    friendlyName: 'Limits Min',
    isSearch: true,
    //isId: true,
    isRequired: true,
    isSelectBox: false,
    isDisplay: false,
    //isLimits: true,
    regex: /^[0-9]*$/,
    error: 'Limits Min field can only contain a number',
  },

  max: {
    friendlyName: 'Limits Max',
    isSearch: true,
  //  isId: true,
    isRequired: true,
    isSelectBox: false,
    isDisplay: false,
  //  isLimits: true,
    regex: /^[0-9]*$/,
    error: 'Limits Max field can only contain a number',
  },

};

const FIELDS =
  Object.keys(FIELDS_INFO).map((n) => Object.assign({name: n}, FIELDS_INFO[n]));


///////Sensors
  const FIELDS_INFO1 = {
    id: {
      friendlyName: 'Sensor ID',
      isSearch: true,
      isId: true,
      isRequired: true,
      isSensorsSearch: true,
      regex: /^[-\w]+$/,
      error: 'Sensor ID field can only contain alphanumerics, - or _ characters',
    },

    model: {
      friendlyName: 'Model',
      isSearch: true,
      isId: true,
      isRequired: true,
      isSensorsSearch: true,
    //  isSelectBox: false,
      //isLimits: false,
      regex: /^[-\w]+$/,
      error: 'Model field can only contain alphanumerics , - or _ characters',
    },


    period: {
      friendlyName: 'Period',
      isSearch: true,
      isId: true,
      isRequired: true,
      isSensorsSearch: true,
      //isSelectBox: true,
      //isLimits: false,
      regex: /(?<=\s|^)\d+(?=\s|$)/,
      error: 'Period field can only contain an integer',
    },


    min: {
      friendlyName: 'Expected Min',
      isSearch: true,
      isId: true,
      isRequired: true,
      isSensorsSearch: false,
      //isSelectBox: false,
      //isLimits: true,
      regex: /^[0-9]*$/,
      error: 'Expected Min field can only contain a number',
    },

    max: {
      friendlyName: 'Expected Max',
      isSearch: true,
      isId: true,
      isRequired: true,
      isSensorsSearch: false,
    //isSelectBox: false,
    // isLimits: true,
      regex: /^[0-9]*$/,
      error: 'Expected Max field can only contain a number',
    },

  };

  const FIELDS1 =
    Object.keys(FIELDS_INFO1).map((n) => Object.assign({name: n}, FIELDS_INFO1[n]));

//////Functions
///SensorTypes
  function createUserForm(app) {
    return async function(req, res) {
      const model = { base: app.locals.base, fields: FIELDS };
      const html = doMustache(app, 'tst-sensor-types-add', model);
      res.send(html);
    };
  };


  function createUpdateUser(app) {
    return async function(req, res) {
      const user = getNonEmptyValues(req.body);

      let errors = validate(user, ['id']);

      //console.log("Users :",user);
      user.unit = 'PSI';
    //  console.log("User min",user.min);
    //  console.log("User max",user.max);
    //  console.log("unit :",user.unit);
      let min = user.min;
      let max = user.max;
      user.limits={min,max};
      let x =user.quantity;
      //let y=user.id;
      //let min,max;
      //user.limits={min:user.min,max=user.max};
      //console.log("Limits",user.limits);
      //const isUpdate = req.body.submit === 'update';
      if (!errors) {
        try {
  //console.log("x",x);
      if(x===null || x===undefined){
        const errMsg ={'errors':'A value for Measure must be provided.'};
        const model = { base: app.locals.base, errors:errMsg };
        const html = doMustache(app,'tst-sensor-types-add',model);
          res.send(html);
      }
      else{
  	       await app.locals.model.update('sensor-types',user);

  	     res.redirect(`${app.locals.base}/tst-sensor-types-search.html?id=`+user.id);
          }
        }
        catch (err) {
  	console.error(err);
  	errors = wsErrors(err);
        }
      }
      if (errors) {
        const model = errorModel(app, user, errors);
      //  const html = doMustache(app, (isUpdate) ? 'update' : 'create', model);
      const html = doMustache(app,'tst-sensor-types-add',model);
        res.send(html);
      }
    };
  };
/*  function createUpdateUser(app) {
    return async function(req, res) {
      const user = getNonEmptyValues(req.body);
      let errors = validate(user, ['id']);
      const isUpdate = req.body.submit === 'update';
      if (!errors) {
        try {
  	if (isUpdate) {
  	  await app.locals.model.update(user);
  	}
  	else {
  	  await app.locals.model.'tst-sensor-types-add'(user);
  	}
  	res.redirect(`${app.locals.base}/${user.id}.html`);
        }
        catch (err) {
  	console.error(err);
  	errors = wsErrors(err);
        }
      }
      if (errors) {
        const model = errorModel(app, user, errors);
        const html = doMustache(app, (isUpdate) ? 'update' : 'tst-sensor-types-add', model);
        res.send(html);
      }
    };
  };
*/

function doSearch(app) {
    return async function(req, res) {
      const isSubmit = req.query.submit !== undefined;
      let users = [];
      let errors = undefined;
      const search = getNonEmptyValues(req.query);
        errors = validate(search);
        if (Object.keys(search).length == 0) {
  	const msg = 'at least one search parameter must be specified';

        }
  	const q = querystring.stringify(search);
  	try {
  	  users = await app.locals.model.list('sensor-types',search);

      for(let i=0;i<users.data.length;i++){
        users.data[i].min = users.data[i].limits.min;
        users.data[i].max =users.data[i].limits.max;
      }
  	}
  	catch (err) {
            console.error(err);
  	  errors = wsErrors(err);
  	}
  	if (users.length === 0) {
  	  errors = {_: 'no users found for specified criteria; please retry'};
  	}

     let model;

      if (errors){

        //console.log("aa ",q);

        //let temp = q.split("=");
        //let c =temp[1];
        //console.log("c",c)
        //let str = "no results for sensors id "+c;
      //  console.log("str",str);
        //const errMsg ={'errors':str};
        let fields;
        const errMsg ={'errors':'No results found.'};
        model = { base: app.locals.base, errors:errMsg ,fields :FIELDS};
      }
      else {

        const fields =
        users.data.map((u) => ({id: u.id, fields: fieldsWithValues(u)}));
        model = { base: app.locals.base, users: fields, fields:FIELDS };

      }




      const html = doMustache(app, 'tst-sensor-types-search', model);
      res.send(html);
    };
  };

///////sensors
function addSensors(app) {
  return async function(req, res) {
    const model = { base: app.locals.base, fields: FIELDS1 };
    const html = doMustache(app, 'tst-sensors-add', model);
    res.send(html);
  };
};


function createUpdateUserSensors(app) {
  return async function(req, res) {
    const user = getNonEmptyValues1(req.body);

    let errors = validate1(user, ['id']);

    //console.log("Users :",user);
    //console.log("period:",user.period);
  /*  user.unit = 'PSI';
    console.log("User min",user.min);
    console.log("User max",user.max);
    console.log("unit :",user.unit);
    let min = user.min;
    let max = user.max;
    user.limits={min,max};
    //let min,max;
    //user.limits={min:user.min,max=user.max};
    console.log("Limits",user.limits); */
    //const isUpdate = req.body.submit === 'update';

    let min = user.min;
    let max = user.max;
    user.expected={min,max};
  //  console.log("hehe",user.id);


      try {

    await app.locals.model.update('sensors',user);

  res.redirect(`${app.locals.base}/tst-sensors-search.html?id=`+user.id);
      }
      catch (err) {
  console.error(err);
  errors = wsErrors(err);
      }
    if (errors) {
      const model = errorModel1(app, user, errors);
    const html = doMustache(app,'tst-sensors-add',model);
      res.send(html);
    }
  };
};



function SearchSensors(app) {
  return async function(req, res) {
    const isSubmit = req.query.submit !== undefined;
    let users = [];
    let errors = undefined;
    const search = getNonEmptyValues1(req.query);

      errors = validate1(search);
      if (Object.keys(search).length == 0) {
	const msg = 'at least one search parameter must be specified';
	//errors = Object.assign(errors || {}, { _: msg });
      }
	const q = querystring.stringify(search);
	try {
	  users = await app.locals.model.list('sensors',search);
    for(let i=0;i<users.data.length;i++){
      users.data[i].min = users.data[i].expected.min;
      users.data[i].max =users.data[i].expected.max;
    }
	}
	catch (err) {
          console.error(err);
	  errors = wsErrors(err);
	}
	if (users.length === 0) {
	  errors = {_: 'no users found for specified criteria; please retry'};
	}

    let model, template;

    if (errors){
      let fields;
        //console.log("aa ",q);

        //let temp = q.split("=");
        //let c =temp[1];
        //console.log("c",c)
        //let str = "no results for sensors id "+c;
      //  console.log("str",str);
        //const errMsg ={'errors':str};
      const errMsg ={'errors':'No results found.'};
        model = { base: app.locals.base, errors:errMsg ,fields:FIELDS1};
      }
      else {

        const fields =
    	users.data.map((u) => ({id: u.id, fields: fieldsWithValues1(u)}));

      model = { base: app.locals.base, users: fields ,fields:FIELDS1};

      }



    const html = doMustache(app, 'tst-sensors-search', model);
    res.send(html);
  };
};



  /** Return copy of FIELDS with values and errors injected into it. */
function fieldsWithValues(values, errors={}) {
  return FIELDS.map(function (info) {
    const name = info.name;
    const extraInfo = { value: values[name] };
    if (errors[name]) extraInfo.errorMessage = errors[name];
    return Object.assign(extraInfo, info);
  });
}


////Sensors
function fieldsWithValues1(values, errors={}) {
  return FIELDS1.map(function (info) {
    const name = info.name;
    const extraInfo = { value: values[name] };
    if (errors[name]) extraInfo.errorMessage = errors[name];
    return Object.assign(extraInfo, info);
  });
}

/** Given map of field values and requires containing list of required
 *  fields, validate values.  Return errors hash or falsy if no errors.
 */
function validate(values, requires=[]) {
  const errors = {};
  requires.forEach(function (name) {
    if (values[name] === undefined) {
      errors[name] =
	`A value for '${FIELDS_INFO[name].friendlyName}' must be provided`;
    }
  });
  for (const name of Object.keys(values)) {
    const fieldInfo = FIELDS_INFO[name];
    const value = values[name];
    if (fieldInfo.regex && !value.match(fieldInfo.regex)) {
      errors[name] = fieldInfo.error;
    }
  }
  return Object.keys(errors).length > 0 && errors;
}

//Sensors
function validate1(values, requires=[]) {
  const errors = {};
  requires.forEach(function (name) {
    if (values[name] === undefined) {
      errors[name] =
	`A value for '${FIELDS_INFO1[name].friendlyName}' must be provided`;
    }
  });
  for (const name of Object.keys(values)) {
    const fieldInfo = FIELDS_INFO1[name];
    const value = values[name];
    if (fieldInfo.regex && !value.match(fieldInfo.regex)) {
      errors[name] = fieldInfo.error;
    }
  }
  return Object.keys(errors).length > 0 && errors;
}


function getNonEmptyValues(values) {
  const out = {};
  Object.keys(values).forEach(function(k) {
    if (FIELDS_INFO[k] !== undefined) {
      const v = values[k];
      if (v && v.trim().length > 0) out[k] = v.trim();
    }
  });
  return out;
}

//Sensors
function getNonEmptyValues1(values) {
  const out = {};
  Object.keys(values).forEach(function(k) {
    if (FIELDS_INFO1[k] !== undefined) {
      const v = values[k];
      if (v && v.trim().length > 0) out[k] = v.trim();
    }
  });
  return out;
}

/** Return a model suitable for mixing into a template */
function errorModel(app, values={}, errors={}) {
  return {
    base: app.locals.base,
    errors: errors._,
    fields: fieldsWithValues(values, errors)
  };
}

function errorModel1(app, values={}, errors={}) {
  return {
    base: app.locals.base,
    errors: errors._,
    fields: fieldsWithValues1(values, errors)
  };
}


/************************ General Utilities ****************************/

/** Decode an error thrown by web services into an errors hash
 *  with a _ key.
 */
function wsErrors(err) {
  const msg = (err.message) ? err.message : 'web service error';
  console.error(msg);
  return { _: [ msg ] };
}

function doMustache(app, templateId, view) {
  const templates = { footer: app.templates.footer };
  return Mustache.render(app.templates[templateId], view, templates);
}

function errorPage(app, errors, res) {
  if (!Array.isArray(errors)) errors = [ errors ];
  const html = doMustache(app, 'errors', { errors: errors });
  res.send(html);
}

function isNonEmpty(v) {
  return (v !== undefined) && v.trim().length > 0;
}

function setupTemplates(app) {
  app.templates = {};
  for (let fname of fs.readdirSync(TEMPLATES_DIR)) {
    const m = fname.match(/^([\w\-]+)\.ms$/);
    if (!m) continue;
    try {
      app.templates[m[1]] =
	String(fs.readFileSync(`${TEMPLATES_DIR}/${fname}`));
    }
    catch (e) {
      console.error(`cannot read ${fname}: ${e}`);
      process.exit(1);
    }
  }
}
