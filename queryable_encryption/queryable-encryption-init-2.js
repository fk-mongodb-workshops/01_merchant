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
  const customerMasterKeyCredentials =
    qeHelper.getCustomerMasterKeyCredentials(kmsProviderName);

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
 
  // await qeHelper.dropExistingCollection(encryptedClient, encryptedDatabaseName); 
  // await qeHelper.dropExistingCollection(encryptedClient, keyVaultDatabaseName); 

  // start-encrypted-fields-map
  const encryptedFieldsMap = {
    encryptedFields: {
      fields: [
        {
          path: "patientRecord.ssn",
          bsonType: "string",
          queries: { queryType: "equality" },
        },
        {
          path: "patientRecord.billing",
          bsonType: "object",
        },
      ],
    },
  };
  // end-encrypted-fields-map 

  const clientEncryption = qeHelper.getClientEncryption(
    encryptedClient,
    autoEncryptionOptions
  );
 
  await qeHelper.createEncryptedCollection(
    clientEncryption,
    encryptedClient.db(encryptedDatabaseName),
    encryptedCollectionName,
    kmsProviderName,
    encryptedFieldsMap,
    customerMasterKeyCredentials
  );

  const encryptedCollection = encryptedClient
    .db(encryptedDatabaseName)
    .collection(encryptedCollectionName);

  await encryptedClient.close();
}

runExample().catch(console.dir);
