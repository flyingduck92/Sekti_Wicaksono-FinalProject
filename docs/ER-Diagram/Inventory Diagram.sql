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
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "createdAt" timestamp,
  "updatedAt" timestamp
);

CREATE TABLE "Profile" (
  "id" uuid PRIMARY KEY,
  "username" varchar UNIQUE,
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
  "code" varchar UNIQUE,
  "name" varchar NOT NULL,
  "price" int NOT NULL,
  "stock" int NOT NULL,
  "imageUrl" varchar,
  "CategoryId" uuid,
  "ProfileId" uuid,
  "createdAt" timestamp,
  "updatedAt" timestamp
);

CREATE INDEX "category_name" ON "Category" ("name");

CREATE UNIQUE INDEX ON "Category" ("id");

CREATE INDEX "user_email" ON "User" ("email");

CREATE UNIQUE INDEX ON "User" ("id");

CREATE INDEX "profile_fullname" ON "Profile" ("fullname");

CREATE UNIQUE INDEX ON "Profile" ("username");

CREATE UNIQUE INDEX ON "Profile" ("id");

CREATE INDEX "tool_code" ON "Tool" ("code");

CREATE UNIQUE INDEX ON "Tool" ("id");

ALTER TABLE "Profile" ADD FOREIGN KEY ("UserId") REFERENCES "User" ("id");

ALTER TABLE "Tool" ADD FOREIGN KEY ("ProfileId") REFERENCES "Profile" ("id");

ALTER TABLE "Tool" ADD FOREIGN KEY ("CategoryId") REFERENCES "Category" ("id");
