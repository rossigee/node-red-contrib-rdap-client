var helper = require("node-red-node-test-helper");
var ipLookupNode = require("../rdap-lookup.js");

helper.init(require.resolve('node-red'));

describe('rdap-lookup Node', function () {

  beforeEach(function (done) {
    helper.startServer(done);
  });

  afterEach(function (done) {
    helper.unload();
    helper.stopServer(done);
  });

  it('should be loaded', function (done) {
    var flow = [
      {
        id: "n1",
        type: "rdap-lookup",
        name: "test name"
      }
    ];
    helper.load(ipLookupNode, flow, function () {
      const n1 = helper.getNode("n1");
      try {
        n1.should.have.property('name', 'test name');
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('should return payload containing RDAP lookup results', function (done) {
    var flow = [
      {
        id: "n1",
        type: "rdap-lookup",
        name: "test name",
        wires: [
          [
            "n2"
          ]
        ]
      },
      {
        id: "n2",
        type: "helper"
      }
    ];
    helper.load(ipLookupNode, flow, function () {
      const n2 = helper.getNode('n2');
      const n1 = helper.getNode("n1");
      n2.on('input', function (msg) {
        try {
          msg.payload.should.have.property('objectClassName', 'domain');
          msg.payload.should.have.property('ldhName', 'GOOGLE.COM');
          done();
        } catch (err) {
          done(err);
        }
      });
      n1.receive({ payload: 'google.com' });
    });
  });
});