CREATE TABLE "scenarios" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);

INSERT INTO "scenarios" ("id", "title", "created_at", "updated_at")
VALUES ('3f81c321-1941-4247-9f5d-37bb6a9e8e45', 'サンプルシナリオ', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
