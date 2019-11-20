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

}

const FIELDS_INFO = {
  id: {
    friendlyName: 'Sensor Type ID',
    isSearch: true,
    isId: true,
    isRequired: true,
    isSelectBox: false,
    isLimits: false,
    regex: /^\w+$/,
    error: 'User Id field can only contain alphanumerics or _',
  },

  modelNumber: {
    friendlyName: 'Model Number',
    isSearch: true,
    isId: true,
    isRequired: true,
    isSelectBox: false,
    isLimits: false,
    regex: /^\w+$/,
    error: 'User Id field can only contain alphanumerics or _',
  },

  manufacturer: {
    friendlyName: 'Manufacturer',
    isSearch: true,
    isId: true,
    isRequired: true,
    isSelectBox: false,
    isLimits: false,
    regex: /^\w+$/,
    error: 'User Id field can only contain alphanumerics or _',
  },

  quantity: {
    friendlyName: 'Measure',
    isSearch: true,
    isId: true,
    isRequired: true,
    isSelectBox: true,
    isLimits: false,
    regex: /^\w+$/,
    error: 'User Id field can only contain alphanumerics or _',
  },


  min: {
    friendlyName: 'Min',
    isSearch: false,
    isId: true,
    isRequired: true,
    isSelectBox: false,
    //isLimits: true,
    regex: /^\w+$/,
    error: 'User Id field can only contain alphanumerics or _',
  },

  max: {
    friendlyName: 'Max',
    isSearch: false,
    isId: true,
    isRequired: true,
    isSelectBox: false,
  //  isLimits: true,
    regex: /^\w+$/,
    error: 'User Id field can only contain alphanumerics or _',
  },

};

const FIELDS =
  Object.keys(FIELDS_INFO).map((n) => Object.assign({name: n}, FIELDS_INFO[n]));

//////Functions
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

      console.log("Users :",user);
      user.unit = 'PSI';
      console.log("User min",user.min);
      console.log("User max",user.max);
      console.log("unit :",user.unit);
      let min = user.min;
      let max = user.max;
      user.limits={min,max};
      //let min,max;
      //user.limits={min:user.min,max=user.max};
      console.log("Limits",user.limits);
      //const isUpdate = req.body.submit === 'update';
      if (!errors) {
        try {
  //	if (isUpdate) {
  	  await app.locals.model.update('sensor-types',user);
  	//}
  //	else {
  	//  await app.locals.model.create(user);
  	//}
  	res.redirect(`${app.locals.base}/tst-sensor-types-search.html`);
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
      console.log("search",search);

      if (isSubmit) {
        errors = validate(search);
        if (Object.keys(search).length == 0) {
  	const msg = 'at least one search parameter must be specified';
  	errors = Object.assign(errors || {}, { _: msg });
        }
      //  if (!errors) {
  	const q = querystring.stringify(search);

    let str = q;
    let temp = str.split(':');
    let temp1 = temp1[1];
    //console.log("temp",temp1[1]);

  	try {
      console.log("temp",temp1[1]);
  	  users = await app.locals.model.list('sensor-types',{});
  	}
  	catch (err) {
            console.error(err);
  	  errors = wsErrors(err);
  	}
  	if (users.length === 0) {
  	  errors = {_: 'no users found for specified criteria; please retry'};
  	}
        //}
      }
      let model, template;
  //    if (users.length > 0) {
    //    template = 'details';
        const fields =
  	users.data.map((u) => ({id: u.id, fields: fieldsWithValues(u)}));
        model = { base: app.locals.base, users: fields };
      //}
      //else {
        template =  'tst-sensor-types-search';
        model = errorModel(app, search, errors);
      //}
      const html = doMustache(app, 'tst-sensor-types-search', model);
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

/** Return a model suitable for mixing into a template */
function errorModel(app, values={}, errors={}) {
  return {
    base: app.locals.base,
    errors: errors._,
    fields: fieldsWithValues(values, errors)
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
