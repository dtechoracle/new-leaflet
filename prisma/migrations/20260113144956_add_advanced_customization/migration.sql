-- AlterTable
ALTER TABLE "Project" ADD COLUMN "customCSS" TEXT;
ALTER TABLE "Project" ADD COLUMN "customJS" TEXT;
ALTER TABLE "Project" ADD COLUMN "fontFamily" TEXT;
ALTER TABLE "Project" ADD COLUMN "fontSize" TEXT;
ALTER TABLE "Project" ADD COLUMN "themePreset" TEXT DEFAULT 'default';
