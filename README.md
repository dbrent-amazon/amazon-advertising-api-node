Unofficial NodeJS Advertising API client library.

```javascript
const _amazonAdvertisingApiNode = require('./amazon-advertising-api-node');

let client = _amazonAdvertisingApiNode({
    clientId: 'CLIENT_ID',
    clientSecret: 'CLIENT_SECRET',
    refreshToken: 'REFRESH_TOKEN',
    region: 'na',
    sandbox: true
});

client.doRefreshToken(() => {
    
    client.listProfiles(response => {
        console.log(JSON.stringify(response, null, 2));
    });

});
```