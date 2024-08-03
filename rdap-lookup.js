const rdapClient = require("rdap-client");

module.exports = function (RED) {
    function IPLookupNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.on('input', function (msg) {
            var ipaddress = msg.payload;
            var c = rdapClient.rdapClient(ipaddress);
            c.then(function (result) {
                msg.payload = result;
                node.send(msg);
            }).catch(function (err) {
                node.error(err);
            });
        });
    };
    RED.nodes.registerType("rdap-lookup", IPLookupNode);
};