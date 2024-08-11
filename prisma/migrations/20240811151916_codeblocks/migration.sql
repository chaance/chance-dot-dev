-- CreateTable
CREATE TABLE "CodeRecipe" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "demoUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "CodeRecipe_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CodeRecipeBlock" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "recipeId" TEXT NOT NULL,
    "filename" TEXT,
    "language" TEXT,
    "code" TEXT NOT NULL,
    CONSTRAINT "CodeRecipeBlock_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "CodeRecipe" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
