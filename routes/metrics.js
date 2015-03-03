var express = require('express');
var router = express.Router({mergeParams: true});

var MetricSettings = require('../models/metric-settings');
var Metric = require('../models/metric');

var Scheduler = require('../tasks/scheduler');

router.get('/settings', function(req, res, next) {
    MetricSettings.all(req.params.team, function(err, settingses) {
        res.json(settingses);
    });
});

router.get('/:metric/settings', function (req, res, next) {
    MetricSettings.getInstance(req.params.team, req.params.metric, function (err, settings) {
        res.json(settings);
    });
});

/* create metric setting */
router.post('/:metric/settings', function (req, res) {
    var params = req.body;
    if(!params.metricName) {return res.json({error: 'No metric name specified.'});}
    try {Scheduler.validScheduleJob(params);} catch(e) { return res.json({error: e}); }
    MetricSettings.create(req.params.team, params, function(e, settings) {
        if(e) return res.json({error: e});
        Scheduler.StartNewScheduleMetric(settings);
        res.json({});
    });
});
/* update metric setting */
router.put('/:metric/settings', function (req, res) {
    var params = req.body;
    if(!params._id) return res.json({error: 'No id specified.'});
    if(!params.metricName) {return res.json({error: 'No metric name specified.'});}
    try {Scheduler.validScheduleJob(params);} catch(e) { return res.json({error: e}); }
    MetricSettings.update(params._id, params, function(e, settings) {
        if(e) return res.json({error: e});
        Scheduler.updateScheduleMetric(params._id, settings);
        res.json({});
    });
});

router.post('/:metric', function (req, res) {
    var params = req.body;
    params.metricName = req.params.metric;
    Metric.create(req.params.team, params, function(e) {
        res.json({error: e});
    });
});

router.get('/:metricName/timeframes/:timeFrame', function(req, res, next) {
    Metric.recordsInTimeFrame(req.params.team, req.params.metricName, req.params.timeFrame, function(err, data) {
        res.json(data);
    });
});

router.get('/:metricName/timeframes/:timeFrame/general', function(req, res, next) {
    Metric.generalInTimeFrame(req.params.team, req.params.metricName, req.params.timeFrame, function(err, data) {
        res.json(data);
    });
});

router.get('/:metricName/timeframes/:timeFrame/pie', function(req, res, next) {
    Metric.pieInTimeFrame(req.params.team, req.params.metricName, req.params.timeFrame, function(err, data) {
        res.json(data);
    });
});

router.get('/:metricName/timeframes/:timeFrame/trends', function (req, res, next) {
    Metric.trendsInTimeFrame(req.params.team, req.params.metricName, req.params.timeFrame, function(err, data) {
        res.json(data);
    });
});


module.exports = router;
