# Configure Trigger

Open Trigger page and create new Trigger
![image](https://github.com/user-attachments/assets/8e8b9b10-5f2e-474c-a605-dced549b13f8)

Then you can see this screen
![image](https://github.com/user-attachments/assets/5ebe568b-ef2a-41a5-b71d-fec21a39a700)

Go to the App Services screen and link new data source
![image](https://github.com/user-attachments/assets/2398c4c4-8b29-4e26-849c-7a8d1f2eea76)

Choose the data source and save
![image](https://github.com/user-attachments/assets/67b58c6c-b5ab-4a52-98b0-e5b3826fc8ac)

Close this popup window
![image](https://github.com/user-attachments/assets/90594a91-e490-409b-8445-244597ca7541)

Create new function
![image](https://github.com/user-attachments/assets/bb611617-59aa-418f-91af-999ab43059e1)

![image](https://github.com/user-attachments/assets/941e293d-a15e-4f45-b304-89698e125a07)

Go to Function Editor and use this function code
```
exports = async function(arg){ 
  
  var serviceName = "linkaja-dev";
 
  var dbName = "linkaja";
  var collName = "trx_logs";
 
  var collection = context.services.get(serviceName).db(dbName).collection(collName);

  var findResult;
  try {  
    insertResult = await collection.insertOne(arg);

  } catch(err) {
    console.log("Error occurred while executing insertOne:", err.message);

    return { error: err.message };
  }
 
  return { result: insertResult };
};
```

Back to Trigger screen and create new Trigger
![image](https://github.com/user-attachments/assets/8c53e71b-c280-415f-bc03-1b5192781354)

![image](https://github.com/user-attachments/assets/7f42e803-fd63-45c7-92ed-9ea09d0817ce)

![image](https://github.com/user-attachments/assets/d36dc67a-8884-45fa-bb2a-eb2f4e9af95d)


## Known Issue

![image](https://github.com/user-attachments/assets/3e412f92-325b-4edd-9ef1-bd7f988a5efd)

https://www.mongodb.com/community/forums/t/error-while-creating-trigger-restricted-ui-ip-access/267334

How to fix: just wait a bit longer after the cluster creation, try again, and refresh after a while, the Trigger is undergoing creation at the background.
