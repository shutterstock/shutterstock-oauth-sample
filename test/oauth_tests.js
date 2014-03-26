var expect = chai.expect;
describe('shutterstock oauth', function () {
  var requiredOptions, subject, sandbox;
  beforeEach(function () {
    requiredOptions = { client_id: "client_id_number", scope: "user.email user.address", redirect_endpoint: "done.html" };
    sandbox = sinon.sandbox.create();
  });
  afterEach(function () {
    sandbox.restore();
  });
  describe('constructor', function () {
    context('required params', function () {
      it('raises an error if redirect_endpoint is missing', function () {
        delete requiredOptions["redirect_endpoint"];
        expect(function () {
          new ShutterstockOAuth(requiredOptions)
        }).to.throw(Error, /redirect_endpoint/);
      });
      it('raises an error if scope is missing', function () {
        delete requiredOptions["scope"];
        expect(function () {
          new ShutterstockOAuth(requiredOptions)
        }).to.throw(Error, /scope/);
      });
      it('raises an error if client_id is missing', function () {
        delete requiredOptions["client_id"];
        expect(function () {
          new ShutterstockOAuth(requiredOptions)
        }).to.throw(Error, /client_id/);
      });
    });
    context('default values', function () {
      beforeEach(function () {
        subject = new ShutterstockOAuth(requiredOptions);
      });

      it('request_type defaults to "web_server"', function () {
        expect(subject.params.type).to.equal("web_server");
      });
      it('state is set', function () {
        expect(subject.params.state).to.exist;
      })
      it('response_type defaults to "code"', function () {
        expect(subject.params.response_type).to.equal("code");
      });
      it('realm defaults to "customer"', function () {
        expect(subject.realm).to.equal("customer"); 
      });
    });
  });
});
describe('shutterstock oauth util', function () {
  var subject, sandbox;
  beforeEach(function () {
    subject = ShutterstockOAuth.util
    sandbox = sinon.sandbox.create();
  });
  afterEach(function () {
    sandbox.restore();
  });
  describe("clone", function () {
    it("returns an object with all the properties", function () {
      var original = { a: 1, b: 2}
      var result = subject.clone(original);
      expect(result).to.deep.equal(original)
    })
    it("returns a new object", function () {
      var original = { a: 1, b: 2}
      var result = subject.clone(original);
      expect(result).to.not.equal(original)
    })
  });
  describe("buildUrl", function () {
    it("includes all the params in the url", function () {
      var result = subject.buildUrl("example.com", { a: 1, b: 2})
      expect(result).to.equal("example.com?a=1&b=2")
    });
    it("excludes null values in the url", function () {
      var result = subject.buildUrl("example.com", { a: null, b: 2})
      expect(result).to.equal("example.com?b=2")
    });
  });
  describe("getUrlVars", function () {
    it ("returns a hash of the query string vars", function () {
      var result = subject.getUrlVars("http://example.com?a=1&b=2");
      expect(result).to.deep.equal({ a: '1', b: '2'})
    });
    it ("returns a hash of the query string vars on a relative url", function () {
      var result = subject.getUrlVars("/idea?a=1&b=2");
      expect(result).to.deep.equal({ a: '1', b: '2'})
    });
    it ("returns an empty hash if the query string is empty", function () {
      var result = subject.getUrlVars("http://example.com");
      expect(result).to.deep.equal({ })
    });
  });
  describe("isSameDomain", function () {
    var childWindow;
    beforeEach(function () {
      childWindow = { document: { domain: document.domain, URL: "not_blank"}};
    });
    it("returns true if the childs domain matches the current domain", function () {
      expect(subject.isSameDomain(childWindow)).to.be.true;
    });
    it("returns false if the childs url is not 'about:blank'", function () {
      childWindow.document.URL = "about:blank";
      expect(subject.isSameDomain(childWindow)).to.be.false;
    });
    it("returns false if the childs url is empty", function () {
      childWindow.document.URL = "";
      expect(subject.isSameDomain(childWindow)).to.be.false;
    });
    it("returns false if an Securty Error is raised", function () {
      sandbox.stub(subject, "isPresent").throws(Error)
      expect(subject.isSameDomain(childWindow)).to.be.false;
    });
  });
  describe("pathJoin", function () {
    it("combines parent path to the child path", function () {
      expect(subject.pathJoin("parent", "child")).to.equal("parent/child");
    })
    it("raises an error if the childPath is missing", function () {
      expect(function () { subject.pathJoin("parent", null)
      }).to.throw( Error, /childPath/);
    })
    it("raises an error if the parentPath is missing", function () {
      expect(function () { subject.pathJoin(null, "child")
      }).to.throw( Error, /parentPath/);
    })
  });
  describe("ensure", function () {
    it("returns the value passed", function () {
      expect(subject.ensure("value", "var_name")).to.equal("value");
    })
    it("raises an error if the value is missing", function () {
      expect(function () { subject.ensure(null, "var_name")
      }).to.throw( Error, /var_name/);
    })
  });
  describe("fallback", function () {
    it("is returns the first value if present", function () {
      expect(subject.fallback("first", "second")).to.equal("first");
    })
    it("returns the second value if the first is missing", function () {
      expect(subject.fallback(null, "second")).to.equal("second");
    })
  });
  describe("isPresent", function () {
    it("is false for null", function () {
      expect(subject.isPresent(null)).to.be.false;
    })
    it("is false for undefined", function () {
      expect(subject.isPresent(undefined)).to.be.false;
    })
    it("is false for an empty string", function () {
      expect(subject.isPresent('')).to.be.false;
    })
    it("is true for an empty object", function () {
      expect(subject.isPresent({})).to.be.true;
    })
  });
  describe("isNull", function () {
    it("is true for null", function () {
      expect(subject.isNull(null)).to.be.true;
    })
    it("is true for undefined", function () {
      expect(subject.isNull(undefined)).to.be.true;
    })
    it("is false for an object", function () {
      expect(subject.isNull('')).to.be.false;
    })
  });
});

