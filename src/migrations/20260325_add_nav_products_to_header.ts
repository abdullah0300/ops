import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "header_rels" ADD COLUMN "products_id" integer;
    ALTER TABLE "header_rels" ADD CONSTRAINT "header_rels_products_fk"
      FOREIGN KEY ("products_id") REFERENCES "public"."products"("id")
      ON DELETE cascade ON UPDATE no action;
    CREATE INDEX "header_rels_products_id_idx"
      ON "header_rels" USING btree ("products_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "header_rels_products_id_idx";
    ALTER TABLE "header_rels" DROP CONSTRAINT IF EXISTS "header_rels_products_fk";
    ALTER TABLE "header_rels" DROP COLUMN IF EXISTS "products_id";
  `)
}
