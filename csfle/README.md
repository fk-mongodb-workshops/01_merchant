#  Encryption Tutorial

# Pre-requisites

Download from this [Download MongoDB EA](https://www.mongodb.com/try/download/enterprise)

Create .env file, copy the Atlas connection string as MONGODB_URI and MongoDB EA bin folder as the SHARED_LIB_PATH
```
MONGODB_URI=mongodb+srv://<use your userid>:<use your password>@cluster0.0pftinh.mongodb.net/
SHARED_LIB_PATH=C:\Apps\MongoDBEnterprise\bin
```

## Make data local key

Run 
```
node 01_make_data_key_local.js
```

Output
```
DataKeyId [base64]:  cBWrB7H4Sni7/ke0PzBMFA==
```

Copy that content into const.js
```
const DEK = "cBWrB7H4Sni7/ke0PzBMFA==";
module.exports = { DEK } 
```

## Insert encrypted document

Run 
```
node 02_insert_encrypted_document_local.js
```

Output
```
Record inserted successfully {
  acknowledged: true,
  insertedId: new ObjectId('680839d08bdef0d52a9ad50f')
}
```

## Query encrypted document

Run 
```
node 03_query_encrypted_document_local.js
```

Output
```
Finding a document with regular (non-encrypted) client by user_id
{
  _id: new ObjectId('680839d08bdef0d52a9ad50f'),
  name: Binary.createFromBase64('AdR6UVsVYUcIgn8jHeLMX7ICUnM7jvGz1X8V4d2U4rGmpQr2nsvdU6bOIjg/gFqzlnjpWZpLyADASWMjS2nOBk/qru8havwWR9HDJHtOdhlqyYibwd5We2vofXpr3xjWvac=', 6),
  ic_no: Binary.createFromBase64('AtR6UVsVYUcIgn8jHeLMX7ICiwJLo46pCZQSFo1webcI+WSMssxcDibv4AtNFOF5FU9yntRU9PkghB9CouzIQqY1kpeqRlvjVpfKNLnfrrtYdy3GPA5BAWLWR4TW+FVXQeI=', 6),
  amount: Binary.createFromBase64('AdR6UVsVYUcIgn8jHeLMX7IQ2ib+ajW401G5mo9tAVQ/RQo2nK0Pd2yW2+UYPDkiShfK6lI0JjOzExVcu6gkSEWbglPlgWmuYFRNcehtYx72pA==', 6),
  user_id: '0003',
  card: {
    card_no: Binary.createFromBase64('AtR6UVsVYUcIgn8jHeLMX7ICvh82wOKwaWfJiydL9B3cefWZq3I2WjQVw9ctuUjOi8MjNce+VnH+AYF/SH/CCKM0NstnSzQopBaq339TgKuirtams68/8pTypMSw+nUyAqs=', 6),
    card_expiry: '01/2026',
    card_name: Binary.createFromBase64('AdR6UVsVYUcIgn8jHeLMX7ICUnM7jvGz1X8V4d2U4rGmpQr2nsvdU6bOIjg/gFqzlnjpWZpLyADASWMjS2nOBk/qru8havwWR9HDJHtOdhlqyYibwd5We2vofXpr3xjWvac=', 6)
  }
}
---------------------------------

Finding a document with regular (non-encrypted) client by name
null
---------------------------------

Finding a document with encrypted client by user_id
{
  _id: new ObjectId('680839d08bdef0d52a9ad50f'),
  name: 'Asep Suparman',
  ic_no: '3576014403910003',
  amount: 90000,
  user_id: '0003',
  card: {
    card_no: '2424242424242424',
    card_expiry: '01/2026',
    card_name: 'Asep Suparman'
  }
}
---------------------------------

Finding a document with encrypted client by name
{
  _id: new ObjectId('680839d08bdef0d52a9ad50f'),
  name: 'Asep Suparman',
  ic_no: '3576014403910003',
  amount: 90000,
  user_id: '0003',
  card: {
    card_no: '2424242424242424',
    card_expiry: '01/2026',
    card_name: 'Asep Suparman'
  }
}
```