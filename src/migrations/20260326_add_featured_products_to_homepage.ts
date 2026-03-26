import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "home_page_rels" ADD COLUMN IF NOT EXISTS "products_id" integer;
    ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_products_fk"
      FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
    CREATE INDEX IF NOT EXISTS "home_page_rels_products_id_idx" ON "home_page_rels" USING btree ("products_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "home_page_rels_products_id_idx";
    ALTER TABLE "home_page_rels" DROP CONSTRAINT IF EXISTS "home_page_rels_products_fk";
    ALTER TABLE "home_page_rels" DROP COLUMN IF EXISTS "products_id";
  `)
}
