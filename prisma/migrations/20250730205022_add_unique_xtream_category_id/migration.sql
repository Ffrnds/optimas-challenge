/*
  Warnings:

  - A unique constraint covering the columns `[xtream_category_id]` on the table `VodCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[xtream_vod_id]` on the table `VodItem` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VodCategory_xtream_category_id_key" ON "VodCategory"("xtream_category_id");

-- CreateIndex
CREATE UNIQUE INDEX "VodItem_xtream_vod_id_key" ON "VodItem"("xtream_vod_id");
