-- CreateTable
CREATE TABLE "EmailSubscriber" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "nameFirst" TEXT,
    "nameLast" TEXT
);

-- CreateTable
CREATE TABLE "EmailList" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_EmailListToEmailSubscriber" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_EmailListToEmailSubscriber_A_fkey" FOREIGN KEY ("A") REFERENCES "EmailList" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_EmailListToEmailSubscriber_B_fkey" FOREIGN KEY ("B") REFERENCES "EmailSubscriber" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailSubscriber_email_key" ON "EmailSubscriber"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmailList_name_key" ON "EmailList"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_EmailListToEmailSubscriber_AB_unique" ON "_EmailListToEmailSubscriber"("A", "B");

-- CreateIndex
CREATE INDEX "_EmailListToEmailSubscriber_B_index" ON "_EmailListToEmailSubscriber"("B");
