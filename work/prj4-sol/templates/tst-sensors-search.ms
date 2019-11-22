<!DOCTYPE html>
<html>
  <head>
    <title>User Search</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <h1>Search Sensors</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    <form method="GET" action="{{{base}}}/tst-sensors-search.html">

	{{#fields}}
	  {{#isSearch}}
	    <label>
        {{#isSensorsSearch}}
	         <span class="label">{{friendlyName}}</span>


           <input name="{{name}}" {{#type}}type="{{type}}"{{/type}}
            value="{{value}}">
        {{/isSensorsSearch}}

      </label>
	    <br/>
	    {{#errorMessage}}
	      <span class="error">{{errorMessage}}</span><br/>
	    {{/errorMessage}}
	  {{/isSearch}}
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






<table border="5" width="50%" cellpadding="4" cellspacing="3" >

  <tr>
           <th>Sensor ID</th>
           <th>Model</th>
           <th>Period	</th>
           <th colspan="2">Expected Range</th>
  </tr>
  <tr>
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
