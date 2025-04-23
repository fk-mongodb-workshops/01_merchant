# Node.js Queryable Encryption Tutorial


# Pre-requisites

Download from this [Download MongoDB EA](https://www.mongodb.com/try/download/enterprise)

Create .env file, copy the Atlas connection string as MONGODB_URI and MongoDB EA bin folder as the SHARED_LIB_PATH
```
MONGODB_URI=mongodb+srv://<use your userid>:<use your password>@cluster0.0pftinh.mongodb.net/
SHARED_LIB_PATH=C:\Apps\MongoDBEnterprise\bin
```

Configure SHARED_LIB_PATH in the Windows Environments too
![image](https://github.com/user-attachments/assets/cbde70bb-d6e7-4b6b-9191-04f2d3440e03)

## Initialise collection

Run 
```
node 01_queryable_encryption_init.js
```

## Insert encrypted document

Run 
```
node 02_queryable_encryption_insert.js
```

Output
```
Successfully inserted the payment document.
```

## Query encrypted document using encrypted key

Run 
```
node 03_queryable_encryption_query_encrypted_key.js
```

Output
```
{
  _id: new ObjectId('680844be1f07bb849889c360'),
  name: 'Asep Suparman',
  ic_no: '3576014403910003',
  amount: 90000,
  user_id: '0003',
  card: {
    card_no: '2424242424242424',
    card_expiry: '01/2026',
    card_name: 'Asep Suparman'
  },
  __safeContent__: [....]
}
```

## Query encrypted document by range

Run 
```
node 04_queryable_encryption_query_range.js
```

Output
```
{
  _id: new ObjectId('680844be1f07bb849889c360'),
  name: 'Asep Suparman',
  ic_no: '3576014403910003',
  amount: 90000,
  user_id: '0003',
  card: {
    card_no: '2424242424242424',
    card_expiry: '01/2026',
    card_name: 'Asep Suparman'
  },
  __safeContent__: [....]
}
```

