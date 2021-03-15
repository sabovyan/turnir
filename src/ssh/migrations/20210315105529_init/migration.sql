/*
  Warnings:

  - The `participant1Ids` column on the `Game` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `participant2Ids` column on the `Game` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "participant1Ids",
ADD COLUMN     "participant1Ids" INTEGER[],
DROP COLUMN "participant2Ids",
ADD COLUMN     "participant2Ids" INTEGER[];

-- CreateTable
CREATE TABLE "_gameOfParticipant1" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_gameOfParticipant2" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_gameOfParticipant1_AB_unique" ON "_gameOfParticipant1"("A", "B");

-- CreateIndex
CREATE INDEX "_gameOfParticipant1_B_index" ON "_gameOfParticipant1"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_gameOfParticipant2_AB_unique" ON "_gameOfParticipant2"("A", "B");

-- CreateIndex
CREATE INDEX "_gameOfParticipant2_B_index" ON "_gameOfParticipant2"("B");

-- AddForeignKey
ALTER TABLE "_gameOfParticipant1" ADD FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_gameOfParticipant1" ADD FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_gameOfParticipant2" ADD FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_gameOfParticipant2" ADD FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
