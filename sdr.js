async function createSDR(agent) {
    try {


        const identity = await agent.identityManagerCreateIdentity({
            alias: 'bob',
            provider: 'did:ethr:rinkeby',
            kms: 'local'
        });

        const JWT = await agent.createSelectiveDisclosureRequest({
            data: {
                issuer: identity.did,
                tag: 'sdr-one',
                claims: [{
                    reason: 'We need it',
                    claimType: 'name',
                    essential: true
                }]
            }
        });

        console.log('JWT ::: ', JWT);

        const message = await agent.handleMessage({
            raw: JWT,
            save: true,
        });

        console.log('Message ::: ', message);

        const credentials = await agent.getVerifiableCredentialsForSdr({
            sdr: {
                claims: [
                    {
                        claimType: 'name',
                    },
                ],
            },
        });


        console.log('Credentials ::: ', credentials);

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createSDR
}