
module.exports = function AdvertisingApiClient(spec) {
    'use strict';
    let { clientId, clientSecret, region, sandbox, profileId } = spec,
        pjson = require('./package.json'),
        appVersion = pjson.version,
        apiVersion = 'v1',
        accessToken,
        endpointUrl,
        request = require('request'),
        qs = require('querystring'),
        tokenUrl = 'https://api.amazon.com/auth/o2/token',
        userAgent = 'AdvertisingAPI Node Client Library v' + appVersion,
        operation = opSpec => {
            let { iface , method, data, callback } = opSpec;
            let options = {
                url: endpointUrl + iface,
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': userAgent
                },
                auth: {
                    'bearer': accessToken
                },
                body: '',
                qs: '',
                followRedirects: false
            };
            if (profileId) {
                options.headers['Amazon-Advertising-API-Scope'] = profileId;
            }
            switch (method) {
            case 'GET':
                options.qs = data;
                break;
            case 'PUT':
            case 'POST':
            case 'DELETE':
                options.body = JSON.stringify(data);
                break;
            }
            request(options, (error, response, body) => {
                if (!error) {
                    let code = response.statusCode;
                    let responseBody;
                    try {
                        responseBody = JSON.parse(body);
                    } catch (ignore) { 
                        responseBody = body;
                    }
                    return callback({
                        code,
                        requestId: response.headers['x-amz-request-id'],
                        body: responseBody
                    });
                } else {
                    return callback(error);
                }
            });
        },
        getAccessToken = (spec, callback) => {
            let { refreshToken } = spec;
            refreshToken = decodeURIComponent(refreshToken);

            let data = {
                'grant_type': 'refresh_token',
                'refresh_token': refreshToken,
                'client_id': clientId,
                'client_secret': clientSecret
            };
            let options = {
                url: tokenUrl,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    'User-Agent': userAgent
                },
                body: qs.stringify(data)
            };

            request(options, (error, response, body) => {
                if (!error) {
                    if (response.statusCode === 200) {
                        let response = JSON.parse(body);
                        if (response.access_token) {
                            accessToken = response.access_token;
                        }
                        return callback(response);
                    } else {
                        return callback(body);
                    }
                } else {
                    return callback(error);
                }
            });
        },
        setProfileId = id => {
            profileId = id;
        },
        get = (spec, callback) => {
            let { iface, data } = spec;
            let method = 'GET';
            operation({ iface, method, data, callback });
        },
        put = (spec, callback) => {
            let { iface, data } = spec;
            let method = 'PUT';
            operation({ iface, method, data, callback });
        },
        post = (spec, callback) => {
            let { iface, data } = spec;
            let method = 'POST';
            operation({ iface, method, data, callback });
        },
        del = (spec, callback) => {
            let { iface, data } = spec;
            let method = 'DELETE';
            operation({ iface, method, data, callback });
        };
    switch (region.toLowerCase()) {
    case 'eu':
        endpointUrl = 'https://advertising-api-eu.amazon.com/' + apiVersion + '/';
        break;
    default:
        endpointUrl = 'https://advertising-api.amazon.com/' + apiVersion + '/';
    }
    if (sandbox) {
        endpointUrl = 'https://advertising-api-test.amazon.com/' + apiVersion + '/';
    }
    return Object.freeze({
        getAccessToken,
        setProfileId,
        get,
        put,
        post,
        del
    });
};

