http = require('http');
https = require('https');
URL = require('url');

module.exports = (function() {
    function get(url, username, password, cb) {
        url = URL.parse(url);
        var client = url.protocol == 'https:' ? https : http;
        var httpOptions = {
            hostname: url.hostname,
            port: url.port,
            path: url.path,
            method: 'GET',
            headers: {
                "User-Agent": "MeasurementMetric"
            }
        };
        if(username) httpOptions.auth = username + ":" + password;

        client.get(httpOptions, function (res) {
            var data = [];
            res.on('data', function (d) {
                data.push(d);
            }).on('end', function () {
                cb(null, data.join(''));
            }).on('error', function (e) {
                cb(e);
            });
        });
    }

    return {
        get: get
    }
})();
