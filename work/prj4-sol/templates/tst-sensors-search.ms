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
