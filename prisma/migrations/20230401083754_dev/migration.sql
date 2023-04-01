-- CreateTable
CREATE TABLE "bill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pay" INTEGER NOT NULL DEFAULT 0,
    "paused" BOOLEAN NOT NULL DEFAULT false,
    "sended" BOOLEAN NOT NULL DEFAULT false,
    "mail" TEXT,
    "contact" TEXT
);

-- CreateTable
CREATE TABLE "template" (
    "name" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL
);
