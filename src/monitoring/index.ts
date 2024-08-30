import { NextFunction, Request, Response } from "express";
import { httpRequestDurationMicroseconds, requestCounter } from "./requestCount";
import { activeRequestsGauge } from "./activerequests";
export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();
    activeRequestsGauge.inc();

    res.on('finish', function() {
        const endTime = Date.now();
        console.log(`Request took ${endTime - startTime}ms`);
    
        const duration = endTime - startTime;
        // Increment request counter
        requestCounter.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        });
        httpRequestDurationMicroseconds.observe({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status_code: res.statusCode
        }, duration);
        activeRequestsGauge.dec();
    });
    next();
}
