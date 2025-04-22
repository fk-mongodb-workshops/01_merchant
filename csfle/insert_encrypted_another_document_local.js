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

// start-schema
dataKey = params.DEK;

const schema = {
  bsonType: "object",
  encryptMetadata: {
    keyId: [new Binary(Buffer.from(dataKey, "base64"), 4)],
  },
  properties: {
    insurance2: {
      bsonType: "object",
      properties: {
        policyNumber: {
          encrypt: {
            bsonType: "int",
            algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic",
          },
        },
      },
    },
    medicalRecords2: {
      encrypt: {
        bsonType: "array",
        algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
      },
    },
    bloodType2: {
      encrypt: {
        bsonType: "string",
        algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Random",
      },
    },
    ssn2: {
      encrypt: {
        bsonType: "int",
        algorithm: "AEAD_AES_256_CBC_HMAC_SHA_512-Deterministic",
      },
    },
  },
};

var patientSchema = {};
patientSchema[namespace] = schema;
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
    schemaMap: patientSchema,
    // extraOptions: extraOptions,
  },
});
// end-client

async function main() {
  try {
    await secureClient.connect();
    // start-insert
    try {
      const writeResult = await secureClient
        .db(db)
        .collection(coll)
        .insertOne({
          name: "Fernando Karnagi",
          ssn2: 241014209,
          bloodType2: "AB+",
          medicalRecords2: [{ weight: 180, bloodPressure: "120/80" }],
          insurance2: {
            policyNumber: 123142,
            provider: "MaestCare",
          },
        });
    } catch (writeError) {
      console.error("writeError occurred:", writeError);
    }
    // end-insert

    // end-find
  } finally {
    await secureClient.close();
  }
}
main();
