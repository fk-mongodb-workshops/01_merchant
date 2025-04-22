@echo off

mongosh "mongodb://atlas-stream-6806e5e74a542f772a368e3a-hixjx.singapore-sgp.a.query.mongodb.net/" --tls --authenticationDatabase admin --username fkadmin --password fkpassword --file src\02_test_stream.js