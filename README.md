

### OAuth is currently in private alpha. More documention will be released once the feature is released publicly.

<br/>

-----

<br/>

# Basic Usage

Include the script.

```html
<script src="/path/to/shutterstock-oauth.js"></script>
```

Build the oauth object

```javascript
  //build the oauth object
  var options = {
    client_id: "0FF2460C9DD14F449FD5EDF780121F9B",
    scope: "user.email",
    redirect_endpoint: "done.html"
  };
  var oauth = new ShutterstockOAuth(options);
```

Bind the authorize method to a click event

```javascript
  $("#auth_button").on("click", oauth.authorize);
```

# Example

Inside the example folder there is a file index.html. You will need to change `INSERT_YOUR_CLIENT_ID_HERE` to your client id. For the redirect flow to work, the example will need to be running in a web server. The easiest way to do this is run `python -m SimpleHTTPServer` in the root of the project. Then open [http://localhost:8000/example/index.html](http://localhost:8000/example/index.html).

The authorize button will open an authorize pop-up. Below the button, there is a log of the data sent to the callbacks. 

# Options

##### client_id *(required)*

The client_id for the authorized client.


##### scope *(required)*

A string of all requested grant scopes separated by spaces


##### redirect_endpoint *(required)*

The `redirect_endpoint` is relative path from the current domain that the oauth service will redirect to after the authorization is complete.

##### realm *(optional)*

The Shutterstock domain where access will be requested.

Default: `customer`

Possible Values:

* `customer`:    "shutterstock.com"
* `offset`:      "offset.com"
* `contributor`: "contributor-accounts.shutterstock.com"


##### success *(optional)*

A function that will be called when the authorization process is successfully completed.

```javascript
function (data) {
  // data is a hash of the result
};
```

For successful calls, that data object will only have one field: `code`

```javascript
var sampleSuccessData = { code: "xSw2EH5sylIgkZ7Jdp" }
```


##### failure *(optional)*

Callback called when the authorization process fails for any reason.

```javascript
function (data) {
  // data is a hash of the result
};
```
The data object for failures will have three properties:

* `error`:  The type of failure. Most-likely "access_denied"
* `error_reason`: The reason why the authorization failed.
* `error_description`: A human readable version of the error reason.

Example:

```javascript
{
  error: "access_denied",
  error_description: "The popup was closed before authorization was completed.",
  error_reason: "user_denied"
}
```

##### completed *(optional)*

Callback called when the authorization process is completed.

```javascript
function (data) {
  //data is a hash of the result
};
```

The data passed to the `completed` callback is the same that would be passed to the `success` and the `failure` callbacks.


# Methods


##### authorize

Opens a popup for the user to authorize the client. Must be called from a click event.

# License

Copyright (C) 2013 by Shutterstock Images, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
