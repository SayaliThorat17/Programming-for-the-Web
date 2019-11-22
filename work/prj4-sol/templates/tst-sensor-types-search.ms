<!DOCTYPE html>
<html>
  <head>
    <title>User Search</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <h1>Search Sensor Types</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    <form method="GET" action="{{{base}}}/tst-sensor-types-search.html">

	{{#fields}}
  {{#isDisplay}}
	  {{#isSearch}}
	    <label>
	    <span class="label">{{friendlyName}}</span>

      {{#isSelectBox}}
         <select name="Measure" id="quantity" class="tst-Measure">
         <option value="" selected="">
         Select
         </option>

         <option value="pressure">
         Pressure
         </option>
         <option value="temperature">
         Temperature
         </option><option value="flow">
         Flow Rate
         </option>
         <option value="humidity">
         Relative Humidity
         </option>
   </select>
   {{/isSelectBox}}

   {{^isSelectBox}}
         <input name="{{name}}" {{#type}}type="{{type}}"{{/type}}
           value="{{value}}">
   {{/isSelectBox}}

      </label>
	    <br/>
	    {{#errorMessage}}
	      <span class="error">{{errorMessage}}</span><br/>
	    {{/errorMessage}}
	  {{/isSearch}}
    {{/isDisplay}}
	 {{/fields}}
      <input name="search" type="submit" value="search" class="control">



    </form>


    <h2>Results Summary</h2>


   <!--{{#users}}
         <dl>
           {{#fields}}

             <dt>{{friendlyName}}</dt>
             <dd>{{value}}</dd>

   	{{/fields}}

         </dl>
       {{/users}} -->






<table border="5" cellspacing="3"  >

  <tr>
           <th>Sensor Type ID</th>
           <th>Model Number</th>
           <th>Manufacturer</th>
           <th>Measure</th>
           <th colspan="2">Limits</th>
  </tr>
  <tr>
           <th></th>
           <th></th>
           <th></th>
           <th></th>
           <th>Min</th>
           <th>Max</th>
  </tr>

           {{#users}}
           <tr>
            {{#fields}}



                      <td>{{value}}</td>


             {{/fields}}
           </tr>
             {{/users}}

</table>
    {{>footer}}
  </body>
</html>
