-- CreateTable
CREATE TABLE "VodCategory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "xtream_category_id" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "VodItem" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "xtream_vod_id" INTEGER NOT NULL,
    "title_original" TEXT NOT NULL,
    "title_normalized" TEXT NOT NULL,
    "category_id" INTEGER NOT NULL,
    "stream_icon" TEXT,
    "added_at_xtream" DATETIME NOT NULL,
    "container_extension" TEXT NOT NULL,
    CONSTRAINT "VodItem_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "VodCategory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TmdbMovie" (
    "vod_item_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tmdb_id" INTEGER NOT NULL,
    "overview" TEXT NOT NULL,
    "poster_path" TEXT,
    "backdrop_path" TEXT,
    "release_date" DATETIME,
    "runtime" INTEGER,
    "vote_average" REAL,
    "genres" JSONB NOT NULL,
    CONSTRAINT "TmdbMovie_vod_item_id_fkey" FOREIGN KEY ("vod_item_id") REFERENCES "VodItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SyncRun" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "started_at" DATETIME NOT NULL,
    "finished_at" DATETIME,
    "status" TEXT NOT NULL,
    "inserted" INTEGER NOT NULL,
    "updated" INTEGER NOT NULL,
    "skipped" INTEGER NOT NULL,
    "errors_json" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "TmdbCandidate" (
    "vod_item_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "candidate_json" JSONB NOT NULL,
    CONSTRAINT "TmdbCandidate_vod_item_id_fkey" FOREIGN KEY ("vod_item_id") REFERENCES "VodItem" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
