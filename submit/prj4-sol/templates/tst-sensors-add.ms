<!DOCTYPE html>
<html>
  <head>
    <title>Create a User</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <h1>Create / Update Sensors</h1>
    <ul>
      {{#errors}}
        <li class="error">{{.}}</li>
      {{/errors}}
    </ul>
    <form method="POST" action="{{{base}}}/tst-sensors-add.html">

    {{#fields}}
    {{#isSearch}}
  	    <label>
  	    <span class="label">

  	      {{friendlyName}}{{#isRequired}}* {{/isRequired}}
  	    </span>


            <input name="{{name}}" {{#type}}type="{{type}}"{{/type}}
              value="{{value}}">


  	    </label>
  	    <br/>
	    {{#errorMessage}}
	      <span class="error">{{errorMessage}}</span><br/>
	    {{/errorMessage}}
      {{/isSearch}}
	 {{/fields}}
      <input name="submit" type="submit" value="add" class="control">
    </form>
    {{>footer}}
  </body>
</html>
