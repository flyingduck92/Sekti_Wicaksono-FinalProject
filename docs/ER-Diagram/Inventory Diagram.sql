CREATE TYPE "roleName" AS ENUM (
  'staff',
  'admin'
);

CREATE TABLE "Category" (
  "id" uuid PRIMARY KEY,
  "name" varchar NOT NULL,
  "createdAt" timestamp,
  "updatedAt" timestamp
);

CREATE TABLE "User" (
  "id" uuid PRIMARY KEY,
  "email" varchar NOT NULL,
  "password" varchar NOT NULL,
  "createdAt" timestamp,
  "updatedAt" timestamp
);

CREATE TABLE "Profile" (
  "id" uuid PRIMARY KEY,
  "username" varchar,
  "imageUrl" varchar,
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

ALTER TABLE "Profile" ADD FOREIGN KEY ("UserId") REFERENCES "User" ("id");

ALTER TABLE "Tool" ADD FOREIGN KEY ("ProfileId") REFERENCES "Profile" ("id");

ALTER TABLE "Tool" ADD FOREIGN KEY ("CategoryId") REFERENCES "Category" ("id");
