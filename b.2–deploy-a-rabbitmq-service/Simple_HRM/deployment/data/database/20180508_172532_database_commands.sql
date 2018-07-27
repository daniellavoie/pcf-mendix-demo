ALTER TABLE "myfirstmodule$employee" ALTER COLUMN "birthday" RENAME TO "dateofbirth";
ALTER TABLE "myfirstmodule$employee" ADD "phone" VARCHAR_IGNORECASE(200) NULL;
ALTER TABLE "myfirstmodule$employee" ADD "email" VARCHAR_IGNORECASE(200) NULL;
UPDATE "mendixsystem$attribute"
 SET "entity_id" = '403d8ce3-b0a7-4ae9-9a6a-6588f6f44fb7', 
"attribute_name" = 'DateOfBirth', 
"column_name" = 'dateofbirth', 
"type" = 20, 
"length" = 0, 
"default_value" = '', 
"is_auto_number" = false
 WHERE "id" = '74f6b33a-b9ba-48f5-9a67-ff265abc23b4';
INSERT INTO "mendixsystem$attribute" ("id", 
"entity_id", 
"attribute_name", 
"column_name", 
"type", 
"length", 
"default_value", 
"is_auto_number")
 VALUES ('3aa7baec-6fc6-4600-b09a-c9ff18c0260b', 
'403d8ce3-b0a7-4ae9-9a6a-6588f6f44fb7', 
'Email', 
'email', 
30, 
200, 
'', 
false);
INSERT INTO "mendixsystem$attribute" ("id", 
"entity_id", 
"attribute_name", 
"column_name", 
"type", 
"length", 
"default_value", 
"is_auto_number")
 VALUES ('dbc4af8f-0871-4aec-aa13-1686681bab37', 
'403d8ce3-b0a7-4ae9-9a6a-6588f6f44fb7', 
'Phone', 
'phone', 
30, 
200, 
'', 
false);
UPDATE "mendixsystem$version"
 SET "versionnumber" = '4.2', 
"lastsyncdate" = '20180508 17:25:29';
