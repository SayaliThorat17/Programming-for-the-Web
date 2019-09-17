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

    let lastIndex = -1;
    this.lastIndex=lastIndex;

    let nextIndex = -1;
    this.nextIndex=nextIndex;

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
   *  The returned object will contain a this.lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  index property for the next search.  Note that the index (when
   *  set to the this.lastIndex) and count search-spec parameters can be used
   *  in successive calls to allow scrolling through the collection of
   *  all sensor-types which meet some filter criteria.
   *
   *
   *  All user errors must be thrown as an array of objects.
   */
  async findSensorTypes(info) {
    const searchSpecs = validate('findSensorTypes', info);
    //@TODO

	  //console.log(info);

    let result_arr =[];       // return result


   if(searchSpecs.quantity){


        let temp=[];
        temp = this.SensorType_Arr.filter(element => element.quantity === info.quantity);
        //console.log(temp);

        let temp1=[];
        temp1 = temp.filter((element,index) => index > this.nextIndex)

        let sortA = temp.sort(function(a,b){
          return a.id.localeCompare(b.id);
	      });

        //console.log("data : ");
        //console.log(sortA);

        result_arr =sortA.slice();
  }

	else if(info.index){

      this.nextIndex = +info.index + +info.count;

        let cnt = DEFAULT_COUNT;
        //console.log("nice");
        let ind = searchSpecs.index;

        if(searchSpecs.count){
          cnt = info.count;
        }

		    let temp=[];
	      temp = this.SensorType_Arr.filter((element,index) => index>=ind);

		    let temp1=[];
		    temp1 = temp.filter((element,index) => index<cnt);
		    //console.log(temp1);


        let sortA = temp1.sort(function(a,b){
          return a.id.localeCompare(b.id);
	      });

        console.log("nextIndex : ", this.nextIndex);
      //  console.log("data : ");
        //console.log(sortA);

        result_arr =sortA.slice();
	}

  else if(info.id){

    let temp=[];
    temp=this.SensorType_Arr.filter(x => x.id === info.id);

    if (temp === undefined || temp.length == 0){
      console.log("cannot find sensor-type for id " , info.id);
    }

    else{

      //console.log(temp);
      result_arr =temp.slice();
    }

  }

	else {       	// when no info

        this.nextIndex = this.lastIndex + DEFAULT_COUNT +1;

	     let temp=[];
       temp = this.SensorType_Arr.filter((element,index) => index<DEFAULT_COUNT);
       //console.log(temp);

	      let sortA = temp.sort(function(a,b){
          return a.id.localeCompare(b.id);
	      });

          console.log("nextIndex :",this.nextIndex);
		      //console.log("data:");
        	//console.log(sortA);
          result_arr =sortA.slice();

	     }

    return {data : result_arr };
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
   *  The returned object will contain a this.lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  index property for the next search.  Note that the index (when
   *  set to the this.lastIndex) and count search-spec parameters can be used
   *  in successive calls to allow scrolling through the collection of
   *  all sensors which meet some filter criteria.
   *
   *  All user errors must be thrown as an array of objects.
   */
  async findSensors(info) {
    const searchSpecs = validate('findSensors', info);
    //@TODO

    //console.log("in sensor");
    //console.log(info);

      let result_arr =[];       // return result

    if(info.model && info.index && info.count){

      this.nextIndex = +info.index + +info.count;

      let temp=[];
      temp = this.Sensor_Arr.filter((x,index) => index >= info.index);

      let temp1=[];
      temp1 = temp.filter(element => element.model === info.model);

      let temp2=[];
      temp2= temp1.filter((element,index) => index < info.count);

      let sortA = temp2.sort(function(a,b){
        return a.id.localeCompare(b.id);
      });

      //console.log(sortA);
        result_arr =sortA.slice();

  }

else if(info.model && info.count ){
    //console.log("1he");
   let cnt = info.count;
   //console.log("2he");

 let temp=[];
 temp=this.Sensor_Arr.filter(x => x.model === info.model);

 let temp1=[];
 temp1 = temp.filter((element,index) => index<cnt);

   let sortA = temp1.sort(function(a,b){
     return a.id.localeCompare(b.id);
   });

    //console.log(sortA);
     result_arr =sortA.slice();
}

else if(info.id){

  let temp=[];
  temp=this.Sensor_Arr.filter(x => x.id === info.id);

  if (temp === undefined || temp.length == 0){
    console.log("cannot find sensor for id " , info.id);
  }

  else{

    //console.log(temp);
    result_arr =temp.slice();
  }


}
    else {       	// when no info

      this.nextIndex = this.lastIndex + DEFAULT_COUNT +1;
        console.log("nextIndex",this.nextIndex);
         let temp=[];
         temp = this.Sensor_Arr.filter((element,index) => index<DEFAULT_COUNT);
         //console.log(temp);

          let sortA = temp.sort(function(a,b){
            return a.id.localeCompare(b.id);
          });

            //console.log(sortA);
            result_arr =sortA.slice();

      }

    return {data : result_arr};
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


    //console.log("in sensordata");
    //console.log(info);

    let result_arr =[];       // return result

    let cnt = info.count;

    let temp=[];              // filter SensorData_Arr by id
    temp=this.SensorData_Arr.filter(element => element.sensorId === info.sensorId);

    if (temp === undefined || temp.length == 0){
      console.log("unknown sensor id " , info.sensorId);
    }

    let temp2=[];           // filter Sensor_Arr to by id
    temp2 = this.Sensor_Arr.filter(element => element.id === info.sensorId);

    let a;
    for(let i of temp2){      //to get model number to find sensor_type data
     a = i.model;
    //console.log(a);
    }

    let temp3=[];             // to get SensorType_Arr data
    temp3 = this.SensorType_Arr.filter(element => element.id === a);


      let b;      ////// limits min
      let c;      ////// limits max
      for(let i of temp3){     ////here we get lower and upper limits

          b = parseFloat(i.limits.min);
        //console.log(b);
          c = parseFloat(i.limits.max);
        //console.log(c);
      }

      let d;
      let e;
      for(let j of temp2){     ////here we get lower and upper range

          d = parseFloat(j.expected.min);
        //console.log(d);
          e = parseFloat(j.expected.max);
        //console.log(e);
      }


      for(let k of temp){


        if( (parseFloat(k.value)>parseFloat(e) && parseFloat(k.value)<=parseFloat(c)) || (parseFloat(k.value)<parseFloat(d) && parseFloat(k.value)>=parseFloat(b)) ) {
          k.status = 'outOfRange';
        }
        else if(parseFloat(k.value)>=parseFloat(d) && parseFloat(k.value)<=parseFloat(e)){
          k.status = 'ok';
        }
        else{
          k.status = 'error';
        }

      }

    //let subset=[];
    //  subset = (({timestamp,value,status}) => ({'timestamp','value','status'}))(temp);
    //console.log(subset);


      if(info.doDetail ){

        let temp1=[];
        temp1 = temp.filter((element,index) => index<info.count);

        console.log("data : ");
        //console.log(temp1);    //Display info for SensorData

        for(let i of temp1){

          console.log("{\ttimestamp : ",i.timestamp,",");
          console.log("\tvalue : ",i.value,",");
          console.log("\tstatus : ",i.status,"},");
        }

        console.log("SensorType : ")
        console.log(temp3);    //Display info for SensorType

        console.log("Sensor : ")
        console.log(temp2);		////Display info for Sensor

      }

      else if(info.statuses){

        let s = info.statuses;
        /*let s1=info.statuses.next();
        let s2=s1.next.values;
        let s3=s1.next.values; */
        let f = s.split('|') ;
      //  console.log(f[0]);
      //  console.log(f[1]);

          if(f[1] === undefined){

            //console.log("heloz");

            let temp1 =[];
            temp1 = temp.filter(element => element.status === info.statuses);
            //console.log(temp1);

            if(info.timestamp){

              let tempx=[];
              tempx=temp1.filter(element => element.timestamp < info.timestamp);
              //console.log("hehe",tempx)

              let c=[];
              c=tempx.filter((element,index) => index < info.count);
              //console.log(c);
              result_arr =c.slice();
            }
            else{

              let c=[];
              c=temp1.filter((element,index) => index < info.count);
              //console.log(c);
              result_arr =c.slice();
            }

          }
          else{

              //console.log("bye bye");

              let temp1 =[];
              temp1 = temp.filter(element => element.status === f[0] || element.status===f[1]);

              if(info.timestamp){

                let tempx=[];
                tempx=temp1.filter(element => element.timestamp < info.timestamp);
                //console.log("hehe",tempx)

                let c=[];
                c=tempx.filter((element,index) => index < info.count);

                //console.log(c);
                result_arr =c.slice();
              }

              else {

                let c=[];
                c=temp1.filter((element,index) => index < info.count);
                //console.log(c);
                result_arr =c.slice();

              }
          }


      }

      else{

        let temp1=[];
        temp1 = temp.filter((element,index) => index<info.count);
        //console.log(temp1);

        console.log("data :");
        for(let i of temp1){


          console.log("\t{\n\ttimestamp : ",i.timestamp,",");
          console.log("\tvalue : ",i.value,",");
          console.log("\tstatus : ",i.status,"\n\t},");
        }

      }


    return {data : result_arr};
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
