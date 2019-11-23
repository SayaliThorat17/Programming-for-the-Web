<!DOCTYPE html>
<html>
  <head>
    <title>Create a User</title>
    <link rel="stylesheet" href="{{{base}}}/css/style.css">
  </head>
  <body>
    <h1>Create / Update Sensor Types</h1>
    <ul>
      {{#errors}}
        <li class="error">{{errors}}</li>
      {{/errors}}
    </ul>
    <form method="POST" action="{{{base}}}/tst-sensor-types-add.html">

    {{#fields}}
  	    <label>
  	    <span class="label">

  	      {{friendlyName}}{{#isRequired}}* {{/isRequired}}
  	    </span>

         {{#isSelectBox}}
            <select name="quantity" id="quantity" class="tst-Measure">
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
	 {{/fields}}
      <input name="submit" type="submit" value="add" class="control">
    </form>
    {{>footer}}
  </body>
</html>
