"use strict";

(function () {
    var query = require('mysql-query'),
        memcache = require('node-memcache-adapter'),
        crypto = require('crypto'),
        async = require('async');

    module.exports = function (/* arguments */) {
        var args = [].slice.call(arguments),
            cacheTimeKey = args.length - 2, cacheTime, cacheKey, next;

        if (typeof args[cacheTimeKey] === 'number') {
            cacheTime = args.splice(cacheTimeKey, 1).shift();
            cacheKey = crypto.createHash('md5')
                .update(args.slice(0, args.length - 1).toString())
                .digest('hex');
            next = args.splice(args.length - 1, 1).shift();
        }

        if (cacheTime && cacheKey) {
            async.waterfall([
                function getFromMemcache(_next) {
                    memcache.get(cacheKey, _next);
                },
                function getFromMysql(data, _next) {
                    if (data === false) {
                        args.push(function cachingCallback(err, rows, fields) {
                            if (err) return _next(err);
                            memcache.set(cacheKey, rows, cacheTime, function (err) {
                            });
                            return _next.apply(null, arguments);
                        });
                        query.apply(null, args);
                    } else {
                        return _next.apply(null, [null, data, []]);
                    }
                }
            ], next);
            args.push()
        } else {
            query.apply(null, arguments);
        }
    }
}());
