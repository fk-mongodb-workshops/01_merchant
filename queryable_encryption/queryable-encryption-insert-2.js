import "dotenv/config";
import { MongoClient } from "mongodb";
import * as qeHelper from "./queryable-encryption-helpers.js";

async function runExample() {
  // start-setup-application-variables
  const kmsProviderName = "local";

  const uri = process.env.MONGODB_URI; // Your connection URI

  const keyVaultDatabaseName = "encryption_qe";
  const keyVaultCollectionName = "__keyVault";
  const keyVaultNamespace = `${keyVaultDatabaseName}.${keyVaultCollectionName}`;
  const encryptedDatabaseName = "medicalRecords_qe";
  const encryptedCollectionName = "doctors";
  // end-setup-application-variables

  const kmsProviderCredentials =
    qeHelper.getKMSProviderCredentials(kmsProviderName);

  const autoEncryptionOptions = await qeHelper.getAutoEncryptionOptions(
    kmsProviderName,
    keyVaultNamespace,
    kmsProviderCredentials
  );
 
  // start-create-client
  const encryptedClient = new MongoClient(uri, {
    autoEncryption: autoEncryptionOptions,
  });
  // end-create-client

  // start-insert-document
  const patientDocument = {
    patientName: "Jon Doe",
    patientId: 12345678,
    patientRecord: {
      ssn: "987-65-4320",
      billing: {
        type: "Visa",
        number: "4111111111111111",
      },
      billAmount: 1500,
    },
  };
 

  const encryptedCollection = encryptedClient
    .db(encryptedDatabaseName)
    .collection(encryptedCollectionName);

  const result = await encryptedCollection.insertOne(patientDocument);
  // end-insert-document

  if (result.acknowledged) {
    console.log("Successfully inserted the patient document.");
  }

  await encryptedClient.close();
}

runExample().catch(console.dir);
