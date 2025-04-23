import "dotenv/config";
import { MongoClient } from "mongodb";
import * as qeHelper from "./queryable-encryption-helpers.js";

async function runExample() {
  // start-setup-application-variables
  const kmsProviderName = "local";

  const uri = process.env.MONGODB_DB; // Your connection URI

  const keyVaultDatabaseName = "encryption_qe";
  const keyVaultCollectionName = "__keyVault";
  const keyVaultNamespace = `${keyVaultDatabaseName}.${keyVaultCollectionName}`;
  const encryptedDatabaseName = "payment_records_qe";
  const encryptedCollectionName = "payments";
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

  const encryptedCollection = encryptedClient
    .db(encryptedDatabaseName)
    .collection(encryptedCollectionName);

  // start-find-document
  const findResult = await encryptedCollection.findOne({
    "amount": {
      $gte: 9000
    },
  });
  console.log(findResult);
  // end-find-document

  await encryptedClient.close();
}

runExample().catch(console.dir);
