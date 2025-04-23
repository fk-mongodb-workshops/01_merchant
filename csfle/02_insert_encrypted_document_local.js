require("dotenv").config();
const mongodb = require("mongodb");
const { MongoClient, Binary } = mongodb;

var db = "payment_records_csfle";
var coll = "payments";
var namespace = `${db}.${coll}`;
// start-kmsproviders
const fs = require("fs");
const params = require("./const");
const provider = "local";
const path = "./master-key.txt";
const localMasterKey = fs.readFileSync(path);
const kmsProviders = {
  local: {
    key: localMasterKey,
  },
};
// end-kmsproviders

const connectionString = process.env.MONGODB_DB;

// start-key-vault
const keyVaultNamespace = "encryption_csfle.__keyVault";
// end-key-vault

// start-schema
dataKey = params.DEK;
const schema = {
  bsonType: "object",
  encryptMetadata: {
    keyId: [new Binary(Buffer.from(dataKey, "base64"), 4)],
  },
  properties: {
    card: {
      bsonType: "object",
      properties: {
        card_no: {
          encrypt: {
            bsonType: "string",
            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
          },
        },
        card_name: {
          encrypt: {
            bsonType: "string",
            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic",
          },
        },
      },
    },
    name: {
      encrypt: {
        bsonType: "string",
        algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic",
      },
    },
    amount: {
      encrypt: {
        bsonType: "int",
        algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic",
      },
    },
    ic_no: {
      encrypt: {
        bsonType: "string",
        algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
      },
    },
  },
};

var paymentSchema = {};
paymentSchema[namespace] = schema;
// end-schema

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
    schemaMap: paymentSchema,
    // extraOptions: extraOptions,
  },
});

// end-client
const regularClient = new MongoClient(connectionString);

async function main() {
  try {
    await secureClient.connect();

    // start-insert
    try {
      const writeResult = await secureClient
        .db(db)
        .collection(coll)
        .insertOne({
          name: "Asep Suparman",
          ic_no: "3576014403910003",
          amount: 90000,
          user_id: "0003",
          card: { card_no: "2424242424242424", card_expiry: "01/2026", card_name: "Asep Suparman" }
        });
        console.log("Record inserted successfully", writeResult)
    } catch (writeError) {
      console.error("writeError occurred:", writeError);
    }
    // end-insert
  
  } finally {
    await secureClient.close();
  }
}
main();
