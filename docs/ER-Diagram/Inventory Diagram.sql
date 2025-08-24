CREATE TYPE "roleName" AS ENUM (
  'staff',
  'admin',
  'employee'
);

CREATE TYPE "orders_status" AS ENUM (
  'preparing',
  'ready_to_pick',
  'picked_up',
  'returned'
);

CREATE TABLE "Category" (
  "id" uuid PRIMARY KEY,
  "name" varchar,
  "createdAt" timestamp,
  "updatedAt" timestamp
);

CREATE TABLE "User" (
  "id" uuid PRIMARY KEY,
  "email" varchar,
  "password" varchar,
  "createdAt" timestamp,
  "updatedAt" timestamp
);

CREATE TABLE "Profile" (
  "id" uuid PRIMARY KEY,
  "username" varchar,
  "fullname" varchar,
  "dateOfBirth" date,
  "UserId" uuid,
  "role" "roleName" DEFAULT 'staff',
  "createdAt" timestamp,
  "updatedAt" timestamp
);

CREATE TABLE "Tool" (
  "id" uuid PRIMARY KEY,
  "name" varchar,
  "price" int,
  "stock" int,
  "imageUrl" varchar,
  "CategoryId" uuid,
  "ProfileId" uuid,
  "createdAt" timestamp,
  "updatedAt" timestamp
);

CREATE TABLE "Order" (
  "id" uuid,
  "ToolId" uuid,
  "ProfileId" uuid,
  "OrderDate" datetime DEFAULT (now()),
  "PickedUpDate" datetime,
  "ReturnDate" datetime,
  "TypeOfOrder" orders_status,
  "totalItem" integer
);

ALTER TABLE "Profile" ADD FOREIGN KEY ("UserId") REFERENCES "User" ("id");

ALTER TABLE "Tool" ADD FOREIGN KEY ("ProfileId") REFERENCES "Profile" ("id");

ALTER TABLE "Tool" ADD FOREIGN KEY ("CategoryId") REFERENCES "Category" ("id");

ALTER TABLE "Order" ADD FOREIGN KEY ("ToolId") REFERENCES "Tool" ("id");

ALTER TABLE "Order" ADD FOREIGN KEY ("ProfileId") REFERENCES "Profile" ("id");
