"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metricsMiddleware = void 0;
const requestCount_1 = require("./requestCount");
const activerequests_1 = require("./activerequests");
const metricsMiddleware = (req, res, next) => {
    const startTime = Date.now();
    activerequests_1.activeRequestsGauge.inc();
    res.on('finish', function () {
        const endTime = Date.now();
        console.log(`Request took ${endTime - startTime}ms`);
        const duration = endTime - startTime;
        // Increment request counter
        requestCount_1.requestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        });
        requestCount_1.httpRequestDurationMicroseconds.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            code: res.statusCode
        }, duration);
        activerequests_1.activeRequestsGauge.dec();
    });
    next();
};
exports.metricsMiddleware = metricsMiddleware;
