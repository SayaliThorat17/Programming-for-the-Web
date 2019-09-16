'use strict';

const assert = require('assert');



class Sensors {


  constructor(info) {

    //@TODO
	
	let SensorType_Arr = [];  	   	// array to store data from sensor-types.json
    this.SensorType_Arr = SensorType_Arr;
	  let Sensor_Arr = [];         // array to store data from sensors.json
    this.Sensor_Arr = Sensor_Arr;
	  let SensorData_Arr = [];      // array to store data from sensor-data.json
    this.SensorData_Arr = SensorData_Arr;

  }

  /** Clear out all data from this object. */
  async clear() {
    //@TODO
  }

  /** Subject to field validation as per FN_INFOS.addSensorType,
   *  add sensor-type specified by info to this.  Replace any
   *  earlier information for a sensor-type with the same id.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async addSensorType(info) {
    const sensorType = validate('addSensorType', info);
    //@TODO

	 this.SensorType_Arr.push(info);      //Add data to the array

	  //console.log(info);
	  //console.log("Hi");
	 // console.log(SensorType_Arr);

  }


  /** Subject to field validation as per FN_INFOS.addSensor, add
   *  sensor specified by info to this.  Replace any earlier
   *  information for a sensor with the same id.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async addSensor(info) {
    const sensor = validate('addSensor', info);
    //@TODO

	  this.Sensor_Arr.push(info); //Add data to the array
          //console.log(info);
          //console.log("Hi");
          //console.log(this.Sensor_Arr);

  }

  /** Subject to field validation as per FN_INFOS.addSensorData, add
   *  reading given by info for sensor specified by info.sensorId to
   *  this. Replace any earlier reading having the same timestamp for
   *  the same sensor.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async addSensorData(info) {
    const sensorData = validate('addSensorData', info);
    //@TODO

	  this.SensorData_Arr.push(info); //Add data to the array
          //console.log(info);
          //console.log("Hi");
          //console.log(this.SensorData_Arr);

  }

  /** Subject to validation of search-parameters in info as per
   *  FN_INFOS.findSensorTypes, return all sensor-types which
   *  satisfy search specifications in info.  Note that the
   *  search-specs can filter the results by any of the primitive
   *  properties of sensor types.
   *
   *  The returned value should be an object containing a data
   *  property which is a list of sensor-types previously added using
   *  addSensorType().  The list should be sorted in ascending order
   *  by id.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  index property for the next search.  Note that the index (when
   *  set to the lastIndex) and count search-spec parameters can be used
   *  in successive calls to allow scrolling through the collection of
   *  all sensor-types which meet some filter criteria.
   *
   *
   *  All user errors must be thrown as an array of objects.
   */
  async findSensorTypes(info) {
    const searchSpecs = validate('findSensorTypes', info);
    //@TODO

	  //check
	  console.log("in sensor types");
	  console.log(info);
	  console.log("hi");

	 /* if(info.quantity){
	  console.log("Hoho");
	  }
	 */

	 //if(info.quantity){
   if(searchSpecs.quantity){

        let x=  Object.keys(info).map(function(key){ return info[key] });
        console.log(x);

		    let temp=[];
        temp = this.SensorType_Arr.filter((element) => {return element.quantity==x});

        console.log(temp);
        /*
        let sortA = temp.sort(function(a,b){
          return a.id.localeCompare(b.id);
	      });

        console.log(sortA); */
  }

	else if(searchSpecs.index){

        let cnt = DEFAULT_COUNT;
        //console.log("nice");
        let ind = searchSpecs.index;

        if(searchSpecs.count){
          cnt = info.count;
        }
        /*else{

        cnt = DEFAULT_COUNT;
      } */


		    let temp=[];
	      temp = this.SensorType_Arr.filter((element,index) => index>=ind);

		    let temp1=[];
		    temp1 = temp.filter((element,index) => index<cnt);
		    //console.log(temp1);


        let sortA = temp1.sort(function(a,b){
          return a.id.localeCompare(b.id);
	      });

        console.log(sortA);
	}

	else {       	// when no info

	     let temp=[];
       temp = this.SensorType_Arr.filter((element,index) => index<DEFAULT_COUNT);
       //console.log(temp);

	      let sortA = temp.sort(function(a,b){
          return a.id.localeCompare(b.id);
	      });

		console.log("data:");
        	console.log(sortA);


	  }


    return {};
  }

  /** Subject to validation of search-parameters in info as per
   *  FN_INFOS.findSensors, return all sensors which
   *  satisfy search specifications in info.  Note that the
   *  search-specs can filter the results by any of the primitive
   *  properties of a sensor.
   *
   *  The returned value should be an object containing a data
   *  property which is a list of all sensors satisfying the
   *  search-spec which were previously added using addSensor().  The
   *  list should be sorted in ascending order by id.
   *
   *  If info specifies a truthy value for a doDetail property,
   *  then each sensor S returned within the data array will have
   *  an additional S.sensorType property giving the complete
   *  sensor-type for that sensor S.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  index property for the next search.  Note that the index (when
   *  set to the lastIndex) and count search-spec parameters can be used
   *  in successive calls to allow scrolling through the collection of
   *  all sensors which meet some filter criteria.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async findSensors(info) {
    const searchSpecs = validate('findSensors', info);
    //@TODO

    console.log("in sensor");
    console.log(info);

    if(searchSpecs.model && searchSpecs.index){

      //let cnt = info.count;
      //let ind = info.index;

      let temp=[];
      temp=this.Sensor_Arr.filter(x => x.model === info.model);

          console.log(".....");

      /*let temp2=[];
      temp2 = temp.filter((element,index) => index >= info.index);*/

      let temp3 =[];
      temp3 = temp.filter((element,index) => index<info.count);

      /*let temp2=[];
      temp2 = temp.filter((element,index) => index < (ind+count));
      //((element,index) => (index>=ind) ; */

      let sortA = temp3.sort(function(a,b){
        return a.id.localeCompare(b.id);
      }); 

      console.log(sortA); 

  }

else if(searchSpecs.model && searchSpecs.count ){
    console.log("1he");
   let cnt = info.count;
   console.log("2he");

 let temp=[];
 temp=this.Sensor_Arr.filter(x => x.model === info.model);

 let temp1=[];
 temp1 = temp.filter((element,index) => index<cnt);

   let sortA = temp1.sort(function(a,b){
     return a.id.localeCompare(b.id);
   });

   console.log(sortA);
}

    else {       	// when no info

         let temp=[];
         temp = this.Sensor_Arr.filter((element,index) => index<DEFAULT_COUNT);
         //console.log(temp);

          let sortA = temp.sort(function(a,b){
            return a.id.localeCompare(b.id);
          });

          console.log(sortA);

      }





    return {};
  }

  /** Subject to validation of search-parameters in info as per
   *  FN_INFOS.findSensorData, return all sensor reading which satisfy
   *  search specifications in info.  Note that info must specify a
   *  sensorId property giving the id of a previously added sensor
   *  whose readings are desired.  The search-specs can filter the
   *  results by specifying one or more statuses (separated by |).
   *
   *  The returned value should be an object containing a data
   *  property which is a list of objects giving readings for the
   *  sensor satisfying the search-specs.  Each object within data
   *  should contain the following properties:
   *
   *     timestamp: an integer giving the timestamp of the reading.
   *     value: a number giving the value of the reading.
   *     status: one of "ok", "error" or "outOfRange".
   *
   *  The data objects should be sorted in reverse chronological
   *  order by timestamp (latest reading first).
   *
   *  If the search-specs specify a timestamp property with value T,
   *  then the first returned reading should be the latest one having
   *  timestamp <= T.
   *
   *  If info specifies a truthy value for a doDetail property,
   *  then the returned object will have additional
   *  an additional sensorType giving the sensor-type information
   *  for the sensor and a sensor property giving the sensor
   *  information for the sensor.
   *
   *  Note that the timestamp and count search-spec parameters can be
   *  used in successive calls to allow scrolling through the
   *  collection of all readings for the specified sensor.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async findSensorData(info) {
    const searchSpecs = validate('findSensorData', info);
    //@TODO


    console.log("in sensordata");
    console.log(info);

     /*if(info.hasOwnProperty('sensorId')){       	// when no info

       console.log("hola");
     } */

     if(searchSpecs.doDetail ){

     	let cnt = info.count;
       //let id_ = info.sensorId;

       let temp=[];
       temp=this.SensorData_Arr.filter(element => element.sensorId === info.sensorId);

       let temp1=[];
       temp1 = temp.filter((element,index) => index<cnt);


       let temp2=[];
       temp2 = this.Sensor_Arr.filter(element => element.id === info.sensorId);
      

        let a;
       for(let i of temp2){
       	 a = i.model;
       	//console.log(a);
       	}

       	let temp3=[];
       temp3 = this.SensorType_Arr.filter(element => element.id === a);

       console.log("data : ");
       console.log(temp1);    //Display info for SensorData

       console.log("SensorType : ")
       console.log(temp3);    //Display info for SensorType

       console.log("Sensor : ")
       console.log(temp2);		////Display info for Sensor


     }

     
     /*else if(searchSpecs.statuses){


      let temp=[];
       temp=this.SensorData_Arr.filter(element => element.sensorId === info.sensorId);

       
       let temp2=[];
       temp2 = this.Sensor_Arr.filter(element => element.id === info.sensorId); //// for Sensors to find range


       let a;
       let b;
       for(let i of temp2){     ////here we get lower and upper limits of range

        a = i.expected.min;
        //console.log(a);
        b = i.expected.max;
        //console.log(b);
        }


        let result=[];
        let val;

        for(let j of temp){             

          val = j.value;
          //console.log(val);

          if(val<a || val>b){

          }
          else{

            result.push(j); //Add data to the array

          }

        }

        
        let temp1=[];
       temp1 = result.filter((element,index) => index<info.count);

       console.log(temp1);

     } */             //out of range

     else if(info.statuses === 'error'){

      console.log("in error");

      let temp=[];
      temp=this.SensorData_Arr.filter(element => ( (element.sensorId === info.sensorId) ) ) ;

      let temparr=[];
      temparr=temp.filter(element => (element.timestamp <= info.timestamp));

      //console.log(temp);
     
      let temp2=[];
       temp2 = this.Sensor_Arr.filter(element => element.id === info.sensorId); //// for Sensors 


       let a;
       for(let i of temp2){
         a = i.model;
        //console.log(a);
        }

        let temp3=[];
       temp3 = this.SensorType_Arr.filter(element => element.id === a);   ////// for SensorsTypes to find limits

       let b;
       let c;
       for(let i of temp3){     ////here we get lower and upper limits  

        b = i.limits.min;
        //console.log(b);
        c = i.limits.max;
        //console.log(c);
        }

        console.log(b);
        console.log(c);
        //console.log(temparr);

       let result=[];
        let val;

        for(let j of temparr){             

          val = j.value;
          //console.log(val);

          if(val>c || val>b){
            result.push(j); //Add data to the array
          }

          /*if(val<=b && val<=c){}
            else{
            result.push(j); //Add data to the array
          } */
        } 
        console.log(result); 

       
        /*let temp1=[];
        temp1 = result.filter((element,index) => index<info.count);

        console.log(temp1);  */
     }

      else{

        console.log("hooooola");
        let cnt = info.count;

        let temp=[];
        temp=this.SensorData_Arr.filter(element => element.sensorId === info.sensorId);

        let temp1=[];
        temp1 = temp.filter((element,index) => index<cnt);

        console.log(temp1);

      }




    return {};
  }


}

module.exports = Sensors;

//@TODO add auxiliary functions as necessary


const DEFAULT_COUNT = 5;

/** Validate info parameters for function fn.  If errors are
 *  encountered, then throw array of error messages.  Otherwise return
 *  an object built from info, with type conversions performed and
 *  default values plugged in.  Note that any unknown properties in
 *  info are passed unchanged into the returned object.
 */
function validate(fn, info) {
  const errors = [];
  const values = validateLow(fn, info, errors);
  if (errors.length > 0) throw errors;
  return values;
}

function validateLow(fn, info, errors, name='') {
  const values = Object.assign({}, info);
  for (const [k, v] of Object.entries(FN_INFOS[fn])) {
    const validator = TYPE_VALIDATORS[v.type] || validateString;
    const xname = name ? `${name}.${k}` : k;
    const value = info[k];
    const isUndef = (
      value === undefined ||
      value === null ||
      String(value).trim() === ''
    );
    values[k] =
      (isUndef)
      ? getDefaultValue(xname, v, errors)
      : validator(xname, value, v, errors);
  }
  return values;
}

function getDefaultValue(name, spec, errors) {
  if (spec.default !== undefined) {
    return spec.default;
  }
  else {
    errors.push(`missing value for ${name}`);
    return;
  }
}

function validateString(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'string') {
    errors.push(`require type String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
    return;
  }
  else {
    return value;
  }
}

function validateNumber(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  switch (typeof value) {
  case 'number':
    return value;
  case 'string':
    if (value.match(/^[-+]?\d+(\.\d+)?([eE][-+]?\d+)?$/)) {
      return Number(value);
    }
    else {
      errors.push(`value ${value} for ${name} is not a number`);
      return;
    }
  default:
    errors.push(`require type Number or String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
}

function validateInteger(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  switch (typeof value) {
  case 'number':
    if (Number.isInteger(value)) {
      return value;
    }
    else {
      errors.push(`value ${value} for ${name} is not an integer`);
      return;
    }
  case 'string':
    if (value.match(/^[-+]?\d+$/)) {
      return Number(value);
    }
    else {
      errors.push(`value ${value} for ${name} is not an integer`);
      return;
    }
  default:
    errors.push(`require type Number or String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
}

function validateRange(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'object') {
    errors.push(`require type Object for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
  return validateLow('_range', value, errors, name);
}

const STATUSES = new Set(['ok', 'error', 'outOfRange']);

function validateStatuses(name, value, spec, errors) {
  assert(value !== undefined && value !== null && value !== '');
  if (typeof value !== 'string') {
    errors.push(`require type String for ${name} value ${value} ` +
		`instead of type ${typeof value}`);
  }
  if (value === 'all') return STATUSES;
  const statuses = value.split('|');
  const badStatuses = statuses.filter(s => !STATUSES.has(s));
  if (badStatuses.length > 0) {
    errors.push(`invalid status ${badStatuses} in status ${value}`);
  }
  return new Set(statuses);
}

const TYPE_VALIDATORS = {
  'integer': validateInteger,
  'number': validateNumber,
  'range': validateRange,
  'statuses': validateStatuses,
};


/** Documents the info properties for different commands.
 *  Each property is documented by an object with the
 *  following properties:
 *     type: the type of the property.  Defaults to string.
 *     default: default value for the property.  If not
 *              specified, then the property is required.
 */
const FN_INFOS = {
  addSensorType: {
    id: { },
    manufacturer: { },
    modelNumber: { },
    quantity: { },
    unit: { },
    limits: { type: 'range', },
  },
  addSensor:   {
    id: { },
    model: { },
    period: { type: 'integer' },
    expected: { type: 'range' },
  },
  addSensorData: {
    sensorId: { },
    timestamp: { type: 'integer' },
    value: { type: 'number' },
  },
  findSensorTypes: {
    id: { default: null },  //if specified, only matching sensorType returned.
    index: {  //starting index of first result in underlying collection
      type: 'integer',
      default: 0,
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
  },
  findSensors: {
    id: { default: null }, //if specified, only matching sensor returned.
    index: {  //starting index of first result in underlying collection
      type: 'integer',
      default: 0,
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
    doDetail: { //if truthy string, then sensorType property also returned
      default: null,
    },
  },
  findSensorData: {
    sensorId: { },
    timestamp: {
      type: 'integer',
      default: Date.now() + 999999999, //some future date
    },
    count: {  //max # of results
      type: 'integer',
      default: DEFAULT_COUNT,
    },
    statuses: { //ok, error or outOfRange, combined using '|'; returned as Set
      type: 'statuses',
      default: new Set(['ok']),
    },
    doDetail: {     //if truthy string, then sensor and sensorType properties
      default: null,//also returned
    },
  },
  _range: { //pseudo-command; used internally for validating ranges
    min: { type: 'number' },
    max: { type: 'number' },
  },
};
