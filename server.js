const { createAgent, IIdentityManager, IResolver, IKeyManager, IDataStore, IMessageHandler } = require('daf-core');
const { MessageHandler } = require('daf-message-handler');
const { KeyManager } = require('daf-key-manager');
const { IdentityManager } = require('daf-identity-manager');
const { DafResolver } = require('daf-resolver');
const { JwtMessageHandler } = require('daf-did-jwt');
const { CredentialIssuer, ICredentialIssuer, W3cMessageHandler } = require('daf-w3c');
const { EthrIdentityProvider } = require('daf-ethr-did');
const { WebIdentityProvider } = require('daf-web-did');
const { DIDComm, DIDCommMessageHandler, IDIDComm } = require('daf-did-comm');
const { SelectiveDisclosure, ISelectiveDisclosure, SdrMessageHandler } = require('daf-selective-disclosure');
const { KeyManagementSystem, SecretBox } = require('daf-libsodium');
const { Entities, KeyStore, IdentityStore, IDataStoreORM, DataStore, DataStoreORM } = require('daf-typeorm');
const { createConnection } = require('typeorm');

const infuraProjectId = '5ffc47f65c4042ce847ef66a3fa70d4c'
const secretKey = '29739248cad1bd1a0fc4d9b75cd4d2990de535baf5caadfdf8d8f86664aa830c'
const databaseFile = 'database.sqlite'

const dbConnection = createConnection({
  type: 'sqlite',
  database: databaseFile,
  synchronize: true,
  logging: false,
  entities: Entities,
})

const agent = createAgent({
  plugins: [
    new KeyManager({
      store: new KeyStore(dbConnection, new SecretBox(secretKey)),
      kms: {
        local: new KeyManagementSystem(),
      },
    }),
    new IdentityManager({
      store: new IdentityStore(dbConnection),
      defaultProvider: 'did:ethr:rinkeby',
      providers: {
        'did:ethr:rinkeby': new EthrIdentityProvider({
          defaultKms: 'local',
          network: 'rinkeby',
          rpcUrl: 'https://rinkeby.infura.io/v3/' + infuraProjectId,
        }),
        'did:web': new WebIdentityProvider({
          defaultKms: 'local',
        }),
      },
    }),
    new DafResolver({ infuraProjectId }),
    new DataStore(dbConnection),
    new DataStoreORM(dbConnection),
    new MessageHandler({
      messageHandlers: [
        new DIDCommMessageHandler(),
        new JwtMessageHandler(),
        new W3cMessageHandler(),
        new SdrMessageHandler(),
      ],
    }),
    new DIDComm(),
    new CredentialIssuer(),
    new SelectiveDisclosure(),
  ],
});

module.exports = { agent };
