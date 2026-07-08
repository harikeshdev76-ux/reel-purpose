-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('ORIGINALS', 'SALTWATER', 'FRESHWATER');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" "ProductCategory" NOT NULL DEFAULT 'ORIGINALS';
