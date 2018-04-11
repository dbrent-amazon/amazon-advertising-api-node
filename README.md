Unofficial NodeJS Amazon Advertising API client library.

```javascript
const _amazonAdvertisingApiNode = require('./amazon-advertising-api-node');

let client = _amazonAdvertisingApiNode({
    clientId: 'CLIENT_ID',
    clientSecret: 'CLIENT_SECRET',
    region: 'na',
    sandbox: true
});
```

```javascript
client.getAccessToken({
    refreshToken: 'Atzr|Qei...',
}, response => {
    client.get({
        iface: 'profiles',
    }, response => {
        console.log(JSON.stringify(response, null, 2));
    });
});
```

```javascript
client.getAccessToken({
    refreshToken: 'Atzr|Qei...',
}, response => {
    client.setProfileId(958196612321322);

    client.post({
        iface: 'campaigns',
        data: [{
                name: 'Test Node Campaign One',
                campaignType: 'sponsoredProducts',
                targetingType: 'auto',
                state: 'enabled',
                dailyBudget: 1,
                startDate: '20200101'
            },
            {
                name: 'Test Node Campaign Two',
                campaignType: 'sponsoredProducts',
                targetingType: 'manual',
                state: 'enabled',
                dailyBudget: 2,
                startDate: '20200101'
            }]
    }, response => {
        console.log(JSON.stringify(response, null, 2));
    });
});
```