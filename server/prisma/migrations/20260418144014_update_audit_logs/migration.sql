-- AlterTable
ALTER TABLE "audit_logs" ADD COLUMN     "session_id" TEXT;

-- CreateIndex
CREATE INDEX "audit_logs_session_id_idx" ON "audit_logs"("session_id");
