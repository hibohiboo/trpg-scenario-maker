CREATE SCHEMA "trpg-scenario-maker";
--> statement-breakpoint
CREATE TABLE "trpg-scenario-maker"."scenarios" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
