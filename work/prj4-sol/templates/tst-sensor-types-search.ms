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
    <form method="GET" action="{{{base}}}/search.html">

	{{#fields}}
	  {{#isSearch}}
	    <label>
	    <span class="label">{{friendlyName}}</span>

      {{#isSelect}}
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
   {{/isSelect}}

   {{^isSelect}}
         <input name="{{name}}" {{#type}}type="{{type}}"{{/type}}
           value="{{value}}">
   {{/isSelect}}

      </label>
	    <br/>
	    {{#errorMessage}}
	      <span class="error">{{errorMessage}}</span><br/>
	    {{/errorMessage}}
	  {{/isSearch}}
	 {{/fields}}
      <input name="search" type="submit" value="search" class="control">


      <h2>Results Summary</h2>
      <table class="summary">
        <thead>
    	   <tr>
                  <th>Manufacturer</th>
                  <th>Sensor Type ID</th>
                  <th>Model Number</th>
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
         </thead>
         <tbody>
                 <tr>
                         <td class="tst-manufacturer">
    		       TG
    		     </td>
                         <td class="tst-sensor-type-id">
    		       TG-123
    		     </td>
                         <td class="tst-model-number">
    		       54321
    		     </td>
                         <td class="tst-quantity">
    		       pressure
    		     </td>
                         <td class="numeric interval tst-limits-min">
    		       0
    		     </td>
                         <td class="numeric interval tst-limits-max">
    		       10
    		     </td>
               </tr>
                 <tr>
                         <td class="tst-manufacturer">
    		       asdsad
    		     </td>
                         <td class="tst-sensor-type-id">
    		       asdas
    		     </td>
                         <td class="tst-model-number">
    		       asdasd
    		     </td>
                         <td class="tst-quantity">
    		       temperature
    		     </td>
                         <td class="numeric interval tst-limits-min">
    		       1
    		     </td>
                         <td class="numeric interval tst-limits-max">
    		       1
    		     </td>
               </tr>
                 <tr>
                         <td class="tst-manufacturer">
    		       blazers
    		     </td>
                         <td class="tst-sensor-type-id">
    		       asdf
    		     </td>
                         <td class="tst-model-number">
    		       fda
    		     </td>
                         <td class="tst-quantity">
    		       humidity
    		     </td>
                         <td class="numeric interval tst-limits-min">
    		       69
    		     </td>
                         <td class="numeric interval tst-limits-max">
    		       420
    		     </td>
               </tr>
                 <tr>
                         <td class="tst-manufacturer">
    		       fghfd
    		     </td>
                         <td class="tst-sensor-type-id">
    		       cat1
    		     </td>
                         <td class="tst-model-number">
    		       rtytr
    		     </td>
                         <td class="tst-quantity">
    		       temperature
    		     </td>
                         <td class="numeric interval tst-limits-min">
    		       6
    		     </td>
                         <td class="numeric interval tst-limits-max">
    		       7
    		     </td>
               </tr>
                 <tr>
                         <td class="tst-manufacturer">
    		       fdg
    		     </td>
                         <td class="tst-sensor-type-id">
    		       dfgh
    		     </td>
                         <td class="tst-model-number">
    		       wert
    		     </td>
                         <td class="tst-quantity">
    		       temperature
    		     </td>
                         <td class="numeric interval tst-limits-min">
    		       5
    		     </td>
                         <td class="numeric interval tst-limits-max">
    		       2
    		     </td>
               </tr>
         </tbody>
    </table>

    <div class="scroll">
    <a class="tst-prev" href="?_index=5" rel="prev">&lt;&lt;</a>
    <a class="tst-next" href="?_index=15" rel="next">&gt;&gt;</a>
    </div>



    </form>
    {{>footer}}
  </body>
</html>
