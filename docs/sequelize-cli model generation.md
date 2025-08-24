# UUID Migration
```sh
npx sequelize-cli migration:generate --name enable-uuid-ossp
```

Update `enable-uuid-ossp.js`:
```javascript
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS "uuid-ossp";');
  }
};
```

# Sequelize CLI 
## User Table
```sh
npx sequelize-cli model:generate --name User --attributes email:string
```
## Profile Table
```sh
npx sequelize-cli model:generate --name Profile --attributes username:string,imageUrl:string,fullname:string,dateOfBirth:date,UserId:UUID,role:enum:'{staff,admin}'
```
## Tool Table
```sh
npx sequelize-cli model:generate --name Tool --attributes name:string,price:integer,stock:integer,imageUrl:string,CategoryId:UUID,ProfileId:UUID
```
## Category Table
```sh
npx sequelize-cli model:generate --name Category --attributes name:string
```