ALTER TABLE "myfirstmodule$employee" ADD "level" VARCHAR_IGNORECASE(6) NULL;
INSERT INTO "mendixsystem$attribute" ("id", 
"entity_id", 
"attribute_name", 
"column_name", 
"type", 
"length", 
"default_value", 
"is_auto_number")
 VALUES ('44d524af-4d83-4c71-bc85-7f86f78cabaa', 
'403d8ce3-b0a7-4ae9-9a6a-6588f6f44fb7', 
'Level', 
'level', 
40, 
6, 
'', 
false);
UPDATE "mendixsystem$version"
 SET "versionnumber" = '4.2', 
"lastsyncdate" = '20180508 18:10:47';
