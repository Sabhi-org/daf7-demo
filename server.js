const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const { agent } = require('./agent');
const app = express();

const did = 'did:ethr:rinkeby:0x8db769ae3866186bd4ff280a1db94ce2a85a90d9';
app.use(cors());
app.use(bodyParser.json());


async function apiCall() {
    try {
        // const identity = await agent.identityManagerCreateIdentity({
        //     alias: 'bob2',
        //     provider: 'did:ethr:rinkeby',
        //     kms: 'local'
        // });
        // console.log(identity.did);
        console.log('***************************************************************');

        const result = await agent.identityManagerAddService({
            did: did,
            service: {
                id: did,
                type: 'import identity',
                serviceEndpoint: 'http://localhost:3001/agent',
            },
            options: {
                gas: 1000001
            },
        });

        console.log(result);
        console.log('***************************************************************');

        const response = await axios.post('http://localhost:3001/agent/did', {
            did: did
        });
        console.log(response.data);

        // const importIdentity = await agent.identityManagerImportIdentity({ did: identity.did });
        // console.log(importIdentity);
    } catch (error) {
        console.log(error);
    }
}

apiCall();