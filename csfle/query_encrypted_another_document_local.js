require("dotenv").config();
const mongodb = require("mongodb");
const { MongoClient, Binary } = mongodb;

var db = "medicalRecords_csfle";
var coll = "patients";
var namespace = `${db}.${coll}`;
// start-kmsproviders
const fs = require("fs");
const path = "./master-key.txt";
const params = require("./const");
const localMasterKey = fs.readFileSync(path);
const kmsProviders = {
  local: {
    key: localMasterKey,
  },
};
// end-kmsproviders

const connectionString = process.env.MONGODB_URI;

// start-key-vault
const keyVaultNamespace = "encryption_csfle.__keyVault";
// end-key-vault

// start-extra-options
const extraOptions = {
  cryptSharedLibPath: process.env.SHARED_LIB_PATH,
};
// end-extra-options

// start-client
const secureClient = new MongoClient(connectionString, {
  autoEncryption: {
    keyVaultNamespace,
    kmsProviders,
    // extraOptions: extraOptions,
  },
});
// end-client

async function main() {
  try {
    await secureClient.connect();
    console.log(
      await secureClient.db(db).collection(coll).findOne({ name: /Fernando/ })
    );
  } finally {
    await secureClient.close();
  }
}
main();
