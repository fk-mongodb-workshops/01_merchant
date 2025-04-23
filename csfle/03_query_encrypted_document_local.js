require("dotenv").config();
const mongodb = require("mongodb");
const { MongoClient, Binary } = mongodb;

var db = "payment_records_csfle";
var coll = "payments";
var namespace = `${db}.${coll}`;
// start-kmsproviders
const fs = require("fs");
const path = "./master-key.txt";
const localMasterKey = fs.readFileSync(path);
const params = require("./const");
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

// start-extra-options
const extraOptions = {
  cryptSharedLibPath: process.env.SHARED_LIB_PATH,
};
// end-extra-options

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

// start-client
const secureClient = new MongoClient(connectionString, {
  autoEncryption: {
    keyVaultNamespace,
    kmsProviders,
    schemaMap: paymentSchema
  },
});

const regularClient = new MongoClient(connectionString);

// end-client

async function main() {
  try {
    await secureClient.connect();
    await regularClient.connect();

    console.log("Finding a document with regular (non-encrypted) client by user_id");
    console.log(
      await regularClient.db(db).collection(coll).findOne({ user_id: "0003" })
    );
    console.log("---------------------------------")
    console.log("")
    console.log("Finding a document with regular (non-encrypted) client by name");
    console.log(
      await regularClient.db(db).collection(coll).findOne({
        name: {
          $eq: "Asep Suparman"
        }
      })
    );
    console.log("---------------------------------")
    console.log("")
    console.log("Finding a document with encrypted client by user_id");
    console.log(
      await secureClient.db(db).collection(coll).findOne({ user_id: "0003" })
    );
    console.log("---------------------------------")
    console.log("")
    console.log("Finding a document with encrypted client by name");
    console.log(
      await secureClient.db(db).collection(coll).findOne({
        name: {
          $eq: "Asep Suparman"
        }
      })
    );
  } finally {
    await secureClient.close();
    await regularClient.close();
  }
}
main();
