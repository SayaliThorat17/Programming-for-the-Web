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
	    <span class="label">{{friendlyName}}</span>


         <input name="{{name}}" {{#type}}type="{{type}}"{{/type}}
           value="{{value}}">
   

      </label>
	    <br/>
	    {{#errorMessage}}
	      <span class="error">{{errorMessage}}</span><br/>
	    {{/errorMessage}}
	  {{/isSearch}}
	 {{/fields}}
      <input name="search" type="submit" value="search" class="control">




    </form>
    {{>footer}}
  </body>
</html>
