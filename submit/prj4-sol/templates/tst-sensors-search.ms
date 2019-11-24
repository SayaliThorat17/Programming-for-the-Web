<!DOCTYPE html>
<html>
  <head>
    <title>User Search</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <div class="page">
    <h1>Search Sensors</h1>
    <ul>
      {{#errors}}
        <li class="error">{{errors}}</li>
      {{/errors}}
    </ul>
 <form method="GET" action="{{{base}}}/tst-sensors-search.html">

	{{#fields}}
	  {{#isSearch}}
    {{#isSensorsSearch}}

	    <label>
        <div>

	         <span class="label">{{friendlyName}}</span>
      </label>

           <input name="{{name}}" {{#type}}type="{{type}}"{{/type}}
            value="{{value}}">
            </div>
        {{/isSensorsSearch}}
	    <br/>
	    {{#errorMessage}}
	      <span class="error">{{errorMessage}}</span><br/>
	    {{/errorMessage}}
	  {{/isSearch}}
	 {{/fields}}
      <input name="search" type="submit" value="search" class="control">




    </form>
  </div>



  {{^errors}}
    <h2>Results Summary</h2>

   <!--{{#users}}
         <dl>
           {{#fields}}

             <dt>{{friendlyName}}</dt>
             <dd>{{value}}</dd>

   	{{/fields}}

         </dl>
       {{/users}} -->


<table border="1" width="100%" >

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
            {{#isSearch}}



                      <td style="text-align:center">{{value}}</td>

                        {{/isSearch}}
             {{/fields}}
           </tr>
             {{/users}}

</table>

<div class="scroll">
{{#p}}
    <a class="tst-prev" href="?_index&#x3D;{{p}}" rel="prev">&lt;&lt;</a>
{{/p}}

{{#n}}
    <a class="tst-next" href="?_index&#x3D;{{n}}" rel="next">&gt;&gt;</a>
{{/n}}
    </div>


{{/errors}}

    {{>footer}}
  </body>
</html>
