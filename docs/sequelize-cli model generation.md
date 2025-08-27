# UUID Migration
### 1. Generate Migration UUID
```sh
npx sequelize-cli migration:generate --name enable-uuid-ossp
```
### 2. Update `enable-uuid-ossp.js`
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
# Sequelize CLI Model Generate
### User Table
```sh
npx sequelize-cli model:generate --name User --attributes email:string,password:string
```
### Profile Table
```sh
npx sequelize-cli model:generate --name Profile --attributes username:string,imageUrl:string,fullname:string,dateOfBirth:date,UserId:UUID,role:enum:'{staff,admin}'
```
### Tool Table
```sh
npx sequelize-cli model:generate --name Tool --attributes code:string,name:string,price:integer,stock:integer,imageUrl:string,CategoryId:UUID,ProfileId:UUID
```
### Category Table
```sh
npx sequelize-cli model:generate --name Category --attributes name:string
```
# Sequelize Migrations Update


# Sequelize Models Association
