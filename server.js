const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { agent } = require('./agent');
const app = express();

const did = 'did:ethr:rinkeby:0x985bd59985161605af92d3800f5a6809a5df6a39';
app.use(cors());
app.use(bodyParser.json());
async function identity() {
    const id = await agent.identityManagerCreateIdentity({ provider: 'did:web' });
    console.log(id);
}


async function apiCall() {

    try {
        const webIdentity = await agent.identityManagerGetOrCreateIdentity({
            alias: 'example',
            provider: 'did:web',
            kms: 'local',
        });

        console.log(webIdentity);
        console.log('***************************************************************');

        const result = await agent.identityManagerAddService({
            did: webIdentity.did,
            service: {
                id: 'did:web',
                type: 'identityManagerImportIdentity',
                serviceEndpoint: 'http://localhost:3002',
                description: 'Handles incoming messages',
            },
        });

        console.log(result);
        console.log('***************************************************************');

        const response = await axios.post('http://localhost:3002/agent/did', {
            did: did
        });
        console.log(response.data);

        // const importIdentity = await agent.identityManagerImportIdentity({ did: webIdentity.did });
        // console.log(importIdentity);
    } catch (error) {
        console.log(error.message);
    }
}

apiCall();