'use strict';

const AppError = require('./app-error');
const validate = require('./validate');

const assert = require('assert');
const mongo = require('mongodb').MongoClient;

class Sensors {

  constructor(client, db) {
      this.client = client;
      this.db = db;
    }

  /** Return a new instance of this class with database as
   *  per mongoDbUrl.  Note that mongoDbUrl is expected to
   *  be of the form mongodb://HOST:PORT/DB.
   */
  static async newSensors(mongoDbUrl) {
    //@TODO


        const dbIndex = mongoDbUrl.lastIndexOf('/');
        const url = mongoDbUrl.slice(0, dbIndex);
        //const db = mongoDbUrl.slice(dbIndex + 1);
        const db_Name = mongoDbUrl.slice(dbIndex + 1);
      //  console.log("url is : " ,url);
      //  console.log("DB name is :", db_Name);

        const client = await mongo.connect(url, MONGO_OPTIONS);
          let db = client.db(db_Name);
          //console.log("DB  : ",db);


  /* ////////////////////  /  client.connect(function(err) {
      assert.equal(null, err);
      console.log("Connected successfully to server");

      //const db = client.db(DB_NAME);


      client.close();
    }); *////////////////////////////////////

  /*  mongo.connect(url,{ useUnifiedTopology: true,useNewUrlParser: true },function(err,db){
      if(err){
        console.log(err);
      }
      else {
        console.log('connected to '+ url);
        db.close();
      }
    });   */

    return new Sensors(client, db);
  }

  /** Release all resources held by this Sensors instance.
   *  Specifically, close any database connections.
   */
  async close() {
    //@TODO
    await this.client.close();
  }

  /** Clear database */
  async clear() {
    //@TODO
    await this.db.dropDatabase();
  }

  /** Subject to field validation as per validate('addSensorType',
   *  info), add sensor-type specified by info to this.  Replace any
   *  earlier information for a sensor-type with the same id.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async addSensorType(info) {
    const sensorType = validate('addSensorType', info);
    //@TODO

    //console.log("In Sensor_Types : ");

     //let temp = await this.db.collection("sensorTypes").insertOne(sensorType);
    // let ans = await this.db.collection("sensorTypes").find().toArray();
     //console.log(ans);

     /*let ab =
     let a = this.db.collection("sensorTypes").getElementById(sensorType.id);
     if(a){

     }
     else {
       await this.db.collection("sensorTypes").insertOne(sensorType);
     } */

    /* Boolean status = this.db.collection("sensorTypes").find({id:sensorType.id}).toArray();
     console.log(v);
      if(v){
        console.log("hi");
      }
      else{
        await this.db.collection("sensorTypes").insertOne(sensorType);
      }
*/
let temp = await this.db.collection("sensorTypes").find().toArray();
      for(let i of temp){
      //  let a = this.db.collection("sensorTypes").find({id:sensorType.id}).toArray();
        if(i.id === sensorType.id){

        }
        else{
          await this.db.collection("sensorTypes").insertOne(sensorType);
        }
      }

  }

  /** Subject to field validation as per validate('addSensor', info)
   *  add sensor specified by info to this.  Note that info.model must
   *  specify the id of an existing sensor-type.  Replace any earlier
   *  information for a sensor with the same id.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async addSensor(info) {
    const sensor = validate('addSensor', info);
    //@TODO


    let senType = await this.db.collection("sensorTypes").find().toArray();

    for(let i of senType){

      if(sensor.model === i.id){

        let temp = await this.db.collection("sensors").insertOne(sensor);
        break;
      //  let ans = await this.db.collection("sensors").find().toArray();
      }
    }


  }

  /** Subject to field validation as per validate('addSensorData',
   *  info), add reading given by info for sensor specified by
   *  info.sensorId to this. Note that info.sensorId must specify the
   *  id of an existing sensor.  Replace any earlier reading having
   *  the same timestamp for the same sensor.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async addSensorData(info) {
    const sensorData = validate('addSensorData', info);
    //@TODO

    let sen = await this.db.collection("sensors").find().toArray();

    for(let i of sen){

      if(i.id === sensorData.sensorId){

        let temp = await this.db.collection("sensorData").insertOne(sensorData);
        break;

      }
    }

  }

  /** Subject to validation of search-parameters in info as per
   *  validate('findSensorTypes', info), return all sensor-types which
   *  satisfy search specifications in info.  Note that the
   *  search-specs can filter the results by any of the primitive
   *  properties of sensor types (except for meta-properties starting
   *  with '_').
   *
   *  The returned value should be an object containing a data
   *  property which is a list of sensor-types previously added using
   *  addSensorType().  The list should be sorted in ascending order
   *  by id.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  _index meta-property for the next search.  Note that the _index
   *  (when set to the lastIndex) and _count search-spec
   *  meta-parameters can be used in successive calls to allow
   *  scrolling through the collection of all sensor-types which meet
   *  some filter criteria.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async findSensorTypes(info) {
    //@TODO
    const searchSpecs = validate('findSensorTypes', info);

    let data =[];
    let nextIndex = -1;

    if(searchSpecs.id){

      let id_val = searchSpecs.id;
      //console.log("Id is : ",id_val);

      data = await this.db.collection("sensorTypes").find({id:id_val}).toArray();

    }

    else if(searchSpecs.manufacturer && searchSpecs.quantity){

      //console.log(searchSpecs.manufacturer);
      //console.log(searchSpecs.quantity);

      data = await this.db.collection("sensorTypes").aggregate([
        { $match:{manufacturer:searchSpecs.manufacturer,quantity:searchSpecs.quantity}},
        {$sort : {id:1}},
      ]).toArray();

    }

    else if(searchSpecs.manufacturer && searchSpecs._index){

      if(info._count){

        let cnt = searchSpecs._count;
        let ind = searchSpecs._index;

      data = await this.db.collection("sensorTypes").aggregate([
          { $match:{manufacturer:info.manufacturer}},
          {$sort : {id:1}},
        ]).skip(searchSpecs._index).limit(searchSpecs._count).toArray();

        //console.log("Data is ",data);

        nextIndex = (cnt + 1);

      }
      else{

        let arr =[];

      let cnt=5;  //default

        data = await this.db.collection("sensorTypes").aggregate([
          { $match:{manufacturer:info.manufacturer}},
          {$sort : {id:1}},
        ]).skip(searchSpecs._index).limit(cnt).toArray();

      }

    }


    else{

      data = await this.db.collection("sensorTypes").aggregate([
        { $match:{manufacturer:searchSpecs.manufacturer}},
          {$sort : {id:1}},
      ]).skip(0).limit(5).toArray();


    }

    data.forEach(function (v){
      delete v._id;
    });

    return { data, nextIndex };
  }

  /** Subject to validation of search-parameters in info as per
   *  validate('findSensors', info), return all sensors which satisfy
   *  search specifications in info.  Note that the search-specs can
   *  filter the results by any of the primitive properties of a
   *  sensor (except for meta-properties starting with '_').
   *
   *  The returned value should be an object containing a data
   *  property which is a list of all sensors satisfying the
   *  search-spec which were previously added using addSensor().  The
   *  list should be sorted in ascending order by id.
   *
   *  If info specifies a truthy value for a _doDetail meta-property,
   *  then each sensor S returned within the data array will have an
   *  additional S.sensorType property giving the complete sensor-type
   *  for that sensor S.
   *
   *  The returned object will contain a lastIndex property.  If its
   *  value is non-negative, then that value can be specified as the
   *  _index meta-property for the next search.  Note that the _index (when
   *  set to the lastIndex) and _count search-spec meta-parameters can be used
   *  in successive calls to allow scrolling through the collection of
   *  all sensors which meet some filter criteria.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async findSensors(info) {
    //@TODO
    const searchSpecs = validate('findSensors', info);

    let data =[];
    let final =[];
    let nextIndex = -1;

      if(info._count){

        let ind = searchSpecs._index;
        let cnt = searchSpecs._count;

      data = await this.db.collection("sensors").aggregate([
          { $match:{model:searchSpecs.model}},
          {$sort : {id:1}},
        ]).skip(ind).limit(cnt).toArray();

        nextIndex = ind + cnt;

      }

      else{

      data = await this.db.collection("sensors").aggregate([
          { $match:{model:searchSpecs.model}},
          {$sort : {id:1}},
        ]).skip(0).limit(5).toArray();

        nextIndex = data.length ;

      }

      //console.log("length",data.length);

      if(data.length > 0){
      }
      else{
        nextIndex = -1;
      }

      data.forEach(function (v){
        delete v._id;
      });

    return { data, nextIndex };
  }

  /** Subject to validation of search-parameters in info as per
   *  validate('findSensorData', info), return all sensor readings
   *  which satisfy search specifications in info.  Note that info
   *  must specify a sensorId property giving the id of a previously
   *  added sensor whose readings are desired.  The search-specs can
   *  filter the results by specifying one or more statuses (separated
   *  by |).
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
   *  Note that the timestamp search-spec parameter and _count
   *  search-spec meta-parameters can be used in successive calls to
   *  allow scrolling through the collection of all readings for the
   *  specified sensor.
   *
   *  All user errors must be thrown as an array of AppError's.
   */
  async findSensorData(info) {
    //@TODO
    const searchSpecs = validate('findSensorData', info);

    let data =[];   //result array


    let senType = await this.db.collection("sensorTypes").find().toArray();
    let sen = await this.db.collection("sensors").find().toArray();
    let senData = await this.db.collection("sensorData").find().toArray();

    let cnt = info.count;

    let temp=[];              // filter SensorData_Arr by id
    temp=senData.filter(element => element.sensorId === info.sensorId);
  //  console.log("Temp", temp);

    if (temp === undefined || temp.length == 0){
      //console.log("unknown sensor id " , info.sensorId);
      throw `unknown sensor id "${info.sensorId}"`;
    }

    let temp2=[];           // filter Sensor_Arr to by id
    temp2 = sen.filter(element => element.id === info.sensorId);

    let a;
    for(let i of temp2){      //to get model number to find sensor_type data
     a = i.model;
    //console.log(a);
    }

    let temp3=[];             // to get SensorType_Arr data
    temp3 = senType.filter(element => element.id === a);


      let b;      ////// limits min
      let c;      ////// limits max
      for(let i of temp3){     ////here we get lower and upper limits

          b = parseFloat(i.limits.min);
      //  console.log(b);
         c = parseFloat(i.limits.max);
        //console.log(c);
      }

      let d;
      let e;
      for(let j of temp2){     ////here we get lower and upper range

          d = parseFloat(j.expected.min);
        //console.log(d);
          e = parseFloat(j.expected.max);
      //  console.log(e);
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

      //  console.log("temp :",temp);


          if(info.statuses ){

            let s = info.statuses;
            let f = s.split('|') ;
            //  console.log(f[0]);
            //  console.log(f[1]);

            let c = info._count;
            let cnt ;
            //console.log("c ",c);
            if (c === undefined || c === null) {
              //console.log("hi");
               cnt = 5;
            }
            else {
              cnt = c;
            }

            if(f[1] === undefined){
              //console.log("heloz");

              let temp1 =[];

              if(f[0]==="all"){

              temp1 = temp.filter(element => element.status === 'outOfRange' || element.status === 'ok' || element.status === 'error' )

              }
              else{

                  temp1 = temp.filter(element => element.status === info.statuses);
              }


              if(info.timestamp){

                let tempx=[];
                tempx=temp1.filter(element => element.timestamp <= info.timestamp);
                //console.log("hehe",tempx)
                data = tempx.filter((element,index) => index < cnt);
                //console.log("Data",data);

              }
              else{

                let c=[];
                data = temp1.filter((element,index) => index < cnt);
                //console.log("Data :",data);

            }

          } ////f[1] === undefined

          else {
            //console.log("bye bye");

            let temp1 =[];
            temp1 = temp.filter(element => element.status === f[0] || element.status===f[1]);

            if(info.timestamp){

              let tempx=[];
              tempx=temp1.filter(element => element.timestamp <= info.timestamp);
              //console.log("hehe",tempx)

              data = tempx.filter((element,index) => index < cnt);
            }

            else {
              data = temp1.filter((element,index) => index < cnt);
            }
          }

        }

        else{

            //data = temp.filter((element,index) => index<5);
                    //console.log("temp1",temp1);

            let tri =[];
            tri = temp.filter(element => element.status === 'ok');
            data = tri.filter((element,index) => index<5);

        }

        temp3.forEach(function (v){
          delete v._id;
        });

        temp2.forEach(function (v){
          delete v._id;
        });

        if(info._doDetail){

          console.log("sensorType :",temp3);
          //  return temp3;    //Display info for SensorType

          console.log("Sensor : ",temp2)
            //return temp2;		////Display info for Sensor
        }

      data.forEach(function (v){
        delete v._id;
        delete v.sensorId;
      });

    return { data};
  }



} //class Sensors


/** URL for database images on mongodb server running on default port
 *  on localhost
 */
//const MONGO_URL = 'mongodb://localhost:27017';
//const DB_NAME = 'sensor';


module.exports = Sensors.newSensors;

//Options for creating a mongo client
const MONGO_OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};


function inRange(value, range) {
  return Number(range.min) <= value && value <= Number(range.max);
}
