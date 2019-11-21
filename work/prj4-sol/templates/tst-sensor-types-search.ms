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
	 {{/fields}}
      <input name="search" type="submit" value="search" class="control">



    </form>





   {{#users}}
         <dl>
           {{#fields}}
   	  {{#value}}
             <dt>{{friendlyName}}</dt>
             <dd>{{value}}</dd>
   	  {{/value}}
   	{{/fields}}

         </dl>
       {{/users}}

    {{>footer}}
  </body>
</html>
