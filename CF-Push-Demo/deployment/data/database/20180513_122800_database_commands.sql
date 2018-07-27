ALTER TABLE "myfirstmodule$programitem_photo" ADD CONSTRAINT "uniq_myfirstmodule$programitem_photo_myfirstmodule$programitemid" UNIQUE ("myfirstmodule$programitemid");
ALTER TABLE "myfirstmodule$programitem_photo" ADD CONSTRAINT "uniq_myfirstmodule$programitem_photo_myfirstmodule$photoid" UNIQUE ("myfirstmodule$photoid");
INSERT INTO "mendixsystem$unique_constraint" ("name", 
"table_id", 
"column_id")
 VALUES ('uniq_myfirstmodule$programitem_photo_myfirstmodule$photoid', 
'6a223b4e-008a-4c59-a11b-ecbb5f371c39', 
'7c9f118e-a24d-34df-86ee-a0461a9af44a');
INSERT INTO "mendixsystem$unique_constraint" ("name", 
"table_id", 
"column_id")
 VALUES ('uniq_myfirstmodule$programitem_photo_myfirstmodule$programitemid', 
'6a223b4e-008a-4c59-a11b-ecbb5f371c39', 
'26f0d572-70c6-3908-9d4a-1d375e4997e7');
ALTER TABLE "system$backgroundjob_session" ADD CONSTRAINT "uniq_system$backgroundjob_session_system$backgroundjobid" UNIQUE ("system$backgroundjobid");
INSERT INTO "mendixsystem$unique_constraint" ("name", 
"table_id", 
"column_id")
 VALUES ('uniq_system$backgroundjob_session_system$backgroundjobid', 
'19892a2b-f17a-4c29-80c1-c81f8025b36c', 
'60770e0f-201c-3f24-8a1e-d8b42a715ddb');
ALTER TABLE "system$backgroundjob_xasinstance" ADD CONSTRAINT "uniq_system$backgroundjob_xasinstance_system$backgroundjobid" UNIQUE ("system$backgroundjobid");
INSERT INTO "mendixsystem$unique_constraint" ("name", 
"table_id", 
"column_id")
 VALUES ('uniq_system$backgroundjob_xasinstance_system$backgroundjobid', 
'fc3944c4-7a19-4a4d-9b0d-4a0c9d7aeb23', 
'4fcadd5b-cfd5-3991-bdb8-19c4d63b1aa5');
ALTER TABLE "system$session_user" ADD CONSTRAINT "uniq_system$session_user_system$sessionid" UNIQUE ("system$sessionid");
INSERT INTO "mendixsystem$unique_constraint" ("name", 
"table_id", 
"column_id")
 VALUES ('uniq_system$session_user_system$sessionid', 
'546aaff5-62e1-40ce-ab45-d40d0a0478f1', 
'142c3a11-004d-3f79-916b-d0347144970b');
ALTER TABLE "system$thumbnail_image" ADD CONSTRAINT "uniq_system$thumbnail_image_system$imageid" UNIQUE ("system$imageid");
ALTER TABLE "system$thumbnail_image" ADD CONSTRAINT "uniq_system$thumbnail_image_system$thumbnailid" UNIQUE ("system$thumbnailid");
INSERT INTO "mendixsystem$unique_constraint" ("name", 
"table_id", 
"column_id")
 VALUES ('uniq_system$thumbnail_image_system$imageid', 
'3dbea779-c8af-467e-a957-140c313ac1b7', 
'580b34f8-f2b7-3c00-a872-d0e0b53778ef');
INSERT INTO "mendixsystem$unique_constraint" ("name", 
"table_id", 
"column_id")
 VALUES ('uniq_system$thumbnail_image_system$thumbnailid', 
'3dbea779-c8af-467e-a957-140c313ac1b7', 
'9c4f4f6d-6094-3a1b-a97c-09277561b351');
ALTER TABLE "system$tokeninformation_user" ADD CONSTRAINT "uniq_system$tokeninformation_user_system$tokeninformationid" UNIQUE ("system$tokeninformationid");
INSERT INTO "mendixsystem$unique_constraint" ("name", 
"table_id", 
"column_id")
 VALUES ('uniq_system$tokeninformation_user_system$tokeninformationid', 
'20ca86b2-5a00-4131-aee1-427cb2e94425', 
'4abdbc47-924f-3c57-9257-190d5521d13e');
ALTER TABLE "system$user" ADD CONSTRAINT "uniq_system$user_name" UNIQUE ("name");
INSERT INTO "mendixsystem$unique_constraint" ("name", 
"table_id", 
"column_id")
 VALUES ('uniq_system$user_name', 
'282e2e60-88a5-469d-84a5-ba8d9151644f', 
'69acb4a2-be26-4cc5-902a-a8591d357510');
ALTER TABLE "system$user_language" ADD CONSTRAINT "uniq_system$user_language_system$userid" UNIQUE ("system$userid");
INSERT INTO "mendixsystem$unique_constraint" ("name", 
"table_id", 
"column_id")
 VALUES ('uniq_system$user_language_system$userid', 
'00640985-3c73-4b15-9705-d4ec3ff58e6b', 
'37d87db4-942f-301e-b1d7-ca1c940655fa');
ALTER TABLE "system$user_timezone" ADD CONSTRAINT "uniq_system$user_timezone_system$userid" UNIQUE ("system$userid");
INSERT INTO "mendixsystem$unique_constraint" ("name", 
"table_id", 
"column_id")
 VALUES ('uniq_system$user_timezone_system$userid', 
'bab4a1ab-7d40-47d5-8f21-fc99d089211d', 
'61482ff9-64e6-366d-9055-524387b93b37');
ALTER TABLE "system$userreportinfo_user" ADD CONSTRAINT "uniq_system$userreportinfo_user_system$userreportinfoid" UNIQUE ("system$userreportinfoid");
INSERT INTO "mendixsystem$unique_constraint" ("name", 
"table_id", 
"column_id")
 VALUES ('uniq_system$userreportinfo_user_system$userreportinfoid', 
'd88b344c-b1e5-4759-b60e-0348e63ac445', 
'677bda5e-706d-3d41-b007-247640ca3be1');
UPDATE "mendixsystem$version"
 SET "versionnumber" = '4.2', 
"lastsyncdate" = '20180513 12:27:54';
