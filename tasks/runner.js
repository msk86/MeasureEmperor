httpHelper = require('../helpers/http-helper');
Metric = require('../models/metric');
_ = require('underscore');

module.exports = (function() {
    function runTask(scheduleMetric, cb) {
        var apiMethod = scheduleMetric.apiMethod.toString().trim().replace(/^function.*?\(/, 'function $x(');
        try {
            eval(apiMethod);
        } catch(e) {}

        if(typeof $x != 'function') {
            return;
        }
        httpHelper.get(scheduleMetric.api, scheduleMetric.username, scheduleMetric.password, function(e, raw) {
            try {
                raw = JSON.parse(raw);
            } catch(e) {}
            Metric.lastRecord(scheduleMetric.team, scheduleMetric.metricName, function(e, lastRecord) {
                if(e) return cb(e);
                var result = $x(raw, lastRecord);
                if(result) {
                    result.team = scheduleMetric.team;
                    result.metricName = scheduleMetric.metricName;
                    result.metricValue = result.metricValue == null ? 1 : result.metricValue;
                    cb(null, result);
                }
            });
        });
    }

    return {
        loadScheduleMetric: runTask
    }
})();

