# Populate sample records

Database: customers

Collection: customers
```
{
  "_id": {
    "$oid": "680055f269fa23da2940852f"
  },
  "to_date": {
    "total_spent": 2000000,
    "total_litres": 200,
    "average_spent": 100000,
    "average_litres": 25,
    "most_spbu": "111000",
    "most_product": "RON92"
  },
  "last_refuel": {
    "spbu": "111000",
    "date": "2025-04-15 10:10",
    "amount": 99000,
    "product": "RON92",
    "litres": 20
  },
  "profile": {
    "userid": "0001",
    "name": "Harta Susila Indrajaya"
  },
  "refuels": [
    {
      "amount": 99000,
      "litres": 20,
      "spbu": "111000",
      "date": "2025-04-15 10:10",
      "product": "RON92"
    },
    {
      "amount": 98000,
      "litres": 25,
      "spbu": "111000",
      "date": "2025-04-06 11:10",
      "product": "RON92"
    },
    {
      "amount": 97000,
      "litres": 22,
      "spbu": "111000",
      "date": "2025-04-01 08:10",
      "product": "RON92"
    },
    {
      "amount": 101100,
      "litres": 28,
      "spbu": "111000",
      "date": "2025-03-25 21:15",
      "product": "RON94"
    }
  ]
}
```

Collection: kiosks
```
{
  "_id": {
    "$oid": "6800b5b169fa23da2940855d"
  },
  "kiosk": {
    "id": "111000",
    "kecamatan": "Setiabudi",
    "wilayah": "Jakarta Pusat"
  },
  "to_date": {
    "total_sales": 20000000,
    "total_litres": 20000,
    "average_sales": 100000,
    "average_litres": 25,
    "most_product": "RON92"
  },
  "sales": [
    {
      "amount": 99000,
      "litres": 20,
      "date": "2025-04-15 10:10",
      "product": "RON92"
    },
    {
      "amount": 98000,
      "litres": 25,
      "date": "2025-04-06 11:10",
      "product": "RON92"
    },
    {
      "amount": 97000,
      "litres": 22,
      "date": "2025-04-01 08:10",
      "product": "RON92"
    },
    {
      "amount": 101100,
      "litres": 28,
      "date": "2025-03-25 21:15",
      "product": "RON94"
    }
  ]
}
```

Collection: customer_refuels
```
{
  "_id": {
    "$oid": "6800afa569fa23da2940853b"
  },
  "amount": 99000,
  "litres": 20,
  "spbu": "111000",
  "date": "2025-04-15 10:10",
  "product": "RON92",
  "user_id": "0001"
}
```

# View in Atlas Data Explorer
![image](https://github.com/user-attachments/assets/50382258-9bff-44bf-a6ee-7b9df60cc2cd)
