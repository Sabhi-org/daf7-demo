const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { agent } = require('./agent');
const app = express();

const did = 'did:ethr:rinkeby:0x985bd59985161605af92d3800f5a6809a5df6a39';
app.use(cors());
app.use(bodyParser.json());


async function apiCall() {
    try {
        const identity = await agent.identityManagerGetOrCreateIdentity({
            alias: 'example',
            provider: 'did:ethr:rinkeby',
            kms: 'local',
        });

        console.log(identity);
        console.log('***************************************************************');

        const result = await agent.identityManagerAddService({
            did: identity.did,
            service: {
                id: 'did:ethr:rinkeby',
                type: 'identityManagerImportIdentity',
                serviceEndpoint: 'http://localhost:3002/agent/did',
                description: 'import identity...',
            },
        });

        console.log(result);
        console.log('***************************************************************');

        const response = await axios.post('http://localhost:3002/agent/did', {
            did: identity.did
        });
        // console.log(response.data);

        // const importIdentity = await agent.identityManagerImportIdentity({ did: identity.did });
        // console.log(importIdentity);
    } catch (error) {
        console.log(error);
    }
}

apiCall();


app.listen(5000, () => {
    console.log(`app is live on port 5000...`);
})