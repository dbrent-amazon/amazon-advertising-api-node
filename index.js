
module.exports = function AdvertisingApiClient(spec) {
    'use strict';
    let { clientId, clientSecret, refreshToken, region, sandbox, profileId } = spec,
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
            let { method, iface, data, callback } = opSpec;
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
        doRefreshToken = callback => {
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
        registerBrand = (spec, callback) => {
            let { countryCode, brand } = spec;
            operation({
                method: 'PUT',
                iface: 'profiles/registerBrand',
                data: { countryCode, brand },
                callback
            });
        },
        registerProfile = (spec, callback) => {
            let { countryCode } = spec;
            operation({
                method: 'PUT',
                iface: 'profiles/register',
                data: { countryCode },
                callback
            });
        },
        listProfiles = callback => {
            operation({
                method: 'GET',
                iface: 'profiles',
                callback
            });
        },
        getProfile = (spec, callback) => {
            let { profileId } = spec;
            operation({
                method: 'GET',
                iface: 'profiles/' + profileId,
                callback
            });
        },
        updateProfiles = (profileList, callback) => {
            operation({
                method: 'PUT',
                iface: 'profiles',
                data: profileList,
                callback
            });
        },
        listCampaigns = (spec, callback) => {
            operation({
                method: 'GET',
                iface: 'campaigns',
                data: spec,
                callback
            });
        },
        listCampaignsEx = (spec, callback) => {
            operation({
                method: 'GET',
                iface: 'campaigns/extended',
                data: spec,
                callback
            });
        },
        getCampaign = (spec, callback) => {
            let { campaignId } = spec;
            operation({
                method: 'GET',
                iface: 'campaigns/' + campaignId,
                callback
            });
        },
        getCampaignEx = (spec, callback) => {
            let { campaignId } = spec;
            operation({
                method: 'GET',
                iface: 'campaigns/extended/' + campaignId,
                callback
            });
        },
        createCampaigns = (spec, callback) => {
            operation({
                method: 'POST',
                iface: 'campaigns',
                data: spec,
                callback
            });
        },
        updateCampaigns = (spec, callback) => {
            operation({
                method: 'PUT',
                iface: 'campaigns',
                data: spec,
                callback
            });
        },
        archiveCampaign = (spec, callback) => {
            let { campaignId } = spec;
            operation({
                method: 'DELETE',
                iface: 'campaigns/' + campaignId,
                callback
            });
        },
        getReport = (spec, callback) => {

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
        doRefreshToken,
        setProfileId,
        registerBrand,
        registerProfile,
        listProfiles,
        getProfile,
        updateProfiles,
        listCampaigns,
        listCampaignsEx,
        getCampaign,
        getCampaignEx,
        createCampaigns,
        updateCampaigns,
        archiveCampaign
    });
};

