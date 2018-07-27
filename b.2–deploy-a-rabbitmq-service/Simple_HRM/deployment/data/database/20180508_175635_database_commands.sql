CREATE TABLE "myfirstmodule$employee_department" (
	"myfirstmodule$employeeid" BIGINT NOT NULL,
	"myfirstmodule$departmentid" BIGINT NOT NULL,
	PRIMARY KEY("myfirstmodule$employeeid","myfirstmodule$departmentid"));
CREATE INDEX "idx_myfirstmodule$employee_department_myfirstmodule$department_myfirstmodule$employee" ON "myfirstmodule$employee_department" ("myfirstmodule$departmentid","myfirstmodule$employeeid");
INSERT INTO "mendixsystem$association" ("id", 
"association_name", 
"table_name", 
"parent_entity_id", 
"child_entity_id", 
"parent_column_name", 
"child_column_name", 
"index_name")
 VALUES ('fbc997c1-fa18-4c4c-b150-d0fe63a86039', 
'MyFirstModule.Employee_Department', 
'myfirstmodule$employee_department', 
'403d8ce3-b0a7-4ae9-9a6a-6588f6f44fb7', 
'fc80e129-0a99-4bf1-acfa-b2f55081bbe1', 
'myfirstmodule$employeeid', 
'myfirstmodule$departmentid', 
'idx_myfirstmodule$employee_department_myfirstmodule$department_myfirstmodule$employee');
CREATE TABLE "myfirstmodule$department" (
	"id" BIGINT NOT NULL,
	"description" VARCHAR_IGNORECASE(200) NULL,
	"name" VARCHAR_IGNORECASE(200) NULL,
	PRIMARY KEY("id"));
INSERT INTO "mendixsystem$entity" ("id", 
"entity_name", 
"table_name")
 VALUES ('fc80e129-0a99-4bf1-acfa-b2f55081bbe1', 
'MyFirstModule.Department', 
'myfirstmodule$department');
INSERT INTO "mendixsystem$attribute" ("id", 
"entity_id", 
"attribute_name", 
"column_name", 
"type", 
"length", 
"default_value", 
"is_auto_number")
 VALUES ('3c56f83c-999f-4767-8971-7b4406e8c740', 
'fc80e129-0a99-4bf1-acfa-b2f55081bbe1', 
'Description', 
'description', 
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
 VALUES ('9ddbabb3-1300-4429-8af6-3d94d78336c6', 
'fc80e129-0a99-4bf1-acfa-b2f55081bbe1', 
'Name', 
'name', 
30, 
200, 
'', 
false);
UPDATE "mendixsystem$version"
 SET "versionnumber" = '4.2', 
"lastsyncdate" = '20180508 17:56:33';
