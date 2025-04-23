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

  // start-insert-document
  const paymentDocument = {
    name: "Asep Suparman",
    ic_no: "3576014403910003",
    amount: 90000,
    user_id: "0003",
    card: { card_no: "2424242424242424", card_expiry: "01/2026", card_name: "Asep Suparman" }
  }

  const encryptedCollection = encryptedClient
    .db(encryptedDatabaseName)
    .collection(encryptedCollectionName);

  const result = await encryptedCollection.insertOne(paymentDocument);
  // end-insert-document

  if (result.acknowledged) {
    console.log("Successfully inserted the payment document.");
  }

  await encryptedClient.close();
}

runExample().catch(console.dir);
