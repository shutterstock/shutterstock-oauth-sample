var ShutterstockOAuth = (function () {

    //IE FIX
    if (!window.location.origin) {
      window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    }
    //*****************************
    // UTILITY
    //*****************************
    var _su = {};
    _su.isNull    = function (value) { return value === null || value === undefined; };
    _su.isPresent = function (value) { return !_su.isNull(value) && value !== ''; };
    _su.fallback  = function (value, fallbackValue) {
      return _su.isPresent(value) ? value : fallbackValue;
    };
    _su.ensure = function (value, field) {
      if (_su.isPresent(value)) { return value; }
      else { throw new Error("Missing value. " + field); }
    };
    _su.pathJoin = function (parentPath, childPath) {
      _su.ensure(parentPath, "parentPath")
      _su.ensure(childPath, "childPath")
      parentPath = parentPath.replace(/\/$/, "")
      childPath = childPath.replace(/^\//, "");
      return parentPath + "/" + childPath;
    };
    _su.isSameDomain = function (childWindow) {
      try {
        return _su.isPresent(childWindow.document.URL) &&
               childWindow.document.URL !== 'about:blank' &&
               childWindow.document.domain === document.domain;
      } catch (x) {
        return false;
      }
    };
    _su.getUrlVars = function (url) {
      _su.ensure(url, "url");
      var vars = {}, hash;
      if (url.indexOf('?') < 1) return {}; // no query string // no query string
      var hashes = url.slice(url.indexOf('?') + 1).split('&');
      for (var i = 0; i < hashes.length; i++)
      {
          hash = hashes[i].split('=');
          vars[hash[0]] = decodeURIComponent(hash[1]);
      }
      return vars;
    };
    _su.buildUrl = function (urlPath, params) {
      var url , queryString = "" , seperator = "";
      for( var key in params) {
        if (_su.isPresent(params[key])) {
          queryString += seperator + key + "=" + encodeURI(params[key]);
          seperator = "&";
        }
      }
      return urlPath + "?" + queryString;
    };
    _su.randomString = function () {
      return Math.random().toString(36).slice(2);
    };
    _su.clone = function (original) {
      var doppelganger = {};
      for( var key in original) {
           doppelganger[key] = original[key];
       }
      return doppelganger;
    };
    _su.endpointForRealm = function (realm) {
      if (realm === "offset") return "https://accounts.offset.com/oauth/authorize";
      else if (realm === "contributor") return "https://contributor-accounts.shutterstock.com/oauth/authorize";
      else return "https://accounts.shutterstock.com/oauth/authorize";
    };

    // OAuth Class
    var OAuth = function (options) {
      if (!options) { options = {}; }
      var self = this;

      self.QUERY_PARAMS = ["redirect_uri", "client_id", "response_type", "type", "state", "scope" ];
      self.params = {
        //required
        client_id:     _su.ensure(options.client_id, "client_id"),
        scope:         _su.ensure(options.scope, "scope"),
        redirect_uri:  _su.pathJoin(window.location.origin, _su.ensure(options.redirect_endpoint, "redirect_endpoint")),
        //optional
        type:          _su.fallback(options.request_type, "web_server"),
        state:         _su.fallback(options.state, _su.randomString()),
        response_type: _su.fallback(options.response_type, "code")
      };
      self.realm    = _su.fallback(options.realm, "customer");
      self.endpoint = _su.fallback(options.endpoint, _su.endpointForRealm(self.realm));
      var oauthUrl  = _su.buildUrl(self.endpoint, self.params);
      //callbacks
      self.success  = options.success;
      self.failure  = options.failure;
      self.complete = options.complete;

      //public

      self.authorize = function () {
        _su.ensure(oauthUrl, "oauthUrl");
        self.popup = window.open(oauthUrl, "shutterstockAuth", popupLocation());
        monitorPopup();
      };

      //private

      var monitorPopup = function (context) {
        if (self.popup.closed) {
          handleResponse("popup:closed");
        } else if (_su.isSameDomain(self.popup))  {
          handleResponse("completed", self.popup.document.URL)
          self.popup.close();
        } else {
          setTimeout(monitorPopup, 250, self);
        }
      };

      var handleResponse = function (userAction, responseUrl) {
        var data = {};
        if (_su.isPresent(responseUrl)) {
          data = _su.getUrlVars(responseUrl);
        }
        if (userAction === "popup:closed") {
          data = _su.clone(POPUP_CLOSED_RESPONSE);
        }
        if (_su.isPresent(data["state"])) {
          if (data["state"] !== self.params.state) {
            data = _su.clone(INVALID_STATE_RESPONSE);
          }
          delete data["state"];
        }
        sendResponse(data);
      };

      var sendResponse = function (data) {
        if (_su.isPresent(data["error"])) {
          if (self.failure) { self.failure(data); }
        } else {
          if (self.success) { self.success(data); }
        }
        if (self.complete)  { self.complete(data); }
      }

      var popupLocation = function () {
        var width  = 500, height = 500;
        var left   = (screen.width   / 2) - (width / 2);
        var top    = ((screen.height / 2) - (height/ 2)) * 0.5;
        return 'width='+width+', height='+height+', top='+top+', left='+left;;
      };

      var POPUP_CLOSED_RESPONSE = {
        error: "access_denied",
        error_description: "The popup was closed before authorization was completed.",
        error_reason: "user_denied" };
      var INVALID_STATE_RESPONSE = {
        error: "access_denied",
        error_description: "The response state did not match the request.", //TODO
        error_reason: "invalid_state" };

      return self;
    };

    OAuth.util = _su; //expose the utility methods

    return OAuth;
}());
