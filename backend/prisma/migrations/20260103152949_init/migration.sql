-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'EDITOR', 'REVIEWER');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'PUBLISH', 'REJECT', 'APPROVE', 'REVIEW');

-- CreateEnum
CREATE TYPE "ProfilePublishStatus" AS ENUM ('DRAFT', 'REVIEWED', 'PUBLISHED');

-- CreateEnum
CREATE TYPE "ListStatus" AS ENUM ('DRAFT', 'ANNOUNCED', 'OFFICIAL', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "CandidateStatus" AS ENUM ('POTENTIAL', 'OFFICIAL', 'WITHDRAWN', 'DISQUALIFIED');

-- CreateEnum
CREATE TYPE "PlaceholderPhotoStyle" AS ENUM ('GEOMETRIC', 'INITIALS', 'SILHOUETTE');

-- CreateEnum
CREATE TYPE "AffiliationType" AS ENUM ('PARTY', 'BLOC', 'LIST', 'ROLE', 'ALLIANCE');

-- CreateEnum
CREATE TYPE "StatementKind" AS ENUM ('QUOTE', 'INTERVIEW', 'VOTE', 'PROGRAM', 'OTHER');

-- CreateEnum
CREATE TYPE "ArchiveMethod" AS ENUM ('WAYBACK', 'PDF', 'SCREENSHOT', 'VIDEO_DOWNLOAD', 'MANUAL');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('RECEIVED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RightOfReplyStatus" AS ENUM ('RECEIVED', 'PUBLISHED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CorrectionStatus" AS ENUM ('RECEIVED', 'IN_REVIEW', 'RESOLVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'REVIEWER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorUserId" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "ip" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileVersion" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdByUserId" TEXT NOT NULL,
    "publishStatus" "ProfilePublishStatus" NOT NULL DEFAULT 'DRAFT',
    "snapshot" JSONB NOT NULL,
    "changeNote" TEXT,

    CONSTRAINT "ProfileVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectionCycle" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElectionCycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "District" (
    "id" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "seatCount" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectoralList" (
    "id" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "status" "ListStatus" NOT NULL DEFAULT 'DRAFT',
    "announcedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElectoralList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,
    "currentListId" TEXT,
    "fullNameAr" TEXT NOT NULL,
    "fullNameEn" TEXT NOT NULL,
    "fullNameFr" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "CandidateStatus" NOT NULL DEFAULT 'POTENTIAL',
    "placeholderPhotoStyle" "PlaceholderPhotoStyle" NOT NULL DEFAULT 'GEOMETRIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Affiliation" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "type" "AffiliationType" NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "notes" TEXT,
    "sourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Affiliation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameFr" TEXT NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Statement" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "kind" "StatementKind" NOT NULL,
    "summaryAr" TEXT,
    "summaryEn" TEXT,
    "summaryFr" TEXT,
    "occurredAt" TIMESTAMP(3),
    "sourceId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Statement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "publisher" TEXT NOT NULL,
    "originalUrl" TEXT NOT NULL,
    "archivedUrl" TEXT NOT NULL,
    "archivedAt" TIMESTAMP(3) NOT NULL,
    "archiveMethod" "ArchiveMethod" NOT NULL,
    "contentType" TEXT,
    "checksum" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateSubmission" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contentAr" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "contentFr" TEXT NOT NULL,
    "links" JSONB,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'RECEIVED',
    "decisionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CandidateSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RightOfReply" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contentAr" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "contentFr" TEXT NOT NULL,
    "status" "RightOfReplyStatus" NOT NULL DEFAULT 'RECEIVED',
    "decisionNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RightOfReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CorrectionRequest" (
    "id" TEXT NOT NULL,
    "requesterName" TEXT,
    "requesterEmail" TEXT,
    "candidateId" TEXT,
    "message" TEXT NOT NULL,
    "supportingLinks" JSONB,
    "status" "CorrectionStatus" NOT NULL DEFAULT 'RECEIVED',
    "resolutionNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CorrectionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "AuditLog_actorUserId_idx" ON "AuditLog"("actorUserId");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "ProfileVersion_candidateId_idx" ON "ProfileVersion"("candidateId");

-- CreateIndex
CREATE INDEX "ProfileVersion_publishStatus_idx" ON "ProfileVersion"("publishStatus");

-- CreateIndex
CREATE INDEX "ProfileVersion_createdAt_idx" ON "ProfileVersion"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileVersion_candidateId_versionNumber_key" ON "ProfileVersion"("candidateId", "versionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ElectionCycle_year_key" ON "ElectionCycle"("year");

-- CreateIndex
CREATE INDEX "ElectionCycle_year_idx" ON "ElectionCycle"("year");

-- CreateIndex
CREATE INDEX "ElectionCycle_isActive_idx" ON "ElectionCycle"("isActive");

-- CreateIndex
CREATE INDEX "District_cycleId_idx" ON "District"("cycleId");

-- CreateIndex
CREATE INDEX "District_cycleId_nameAr_idx" ON "District"("cycleId", "nameAr");

-- CreateIndex
CREATE UNIQUE INDEX "District_cycleId_nameAr_key" ON "District"("cycleId", "nameAr");

-- CreateIndex
CREATE INDEX "ElectoralList_cycleId_idx" ON "ElectoralList"("cycleId");

-- CreateIndex
CREATE INDEX "ElectoralList_districtId_idx" ON "ElectoralList"("districtId");

-- CreateIndex
CREATE INDEX "ElectoralList_status_idx" ON "ElectoralList"("status");

-- CreateIndex
CREATE INDEX "ElectoralList_cycleId_districtId_idx" ON "ElectoralList"("cycleId", "districtId");

-- CreateIndex
CREATE UNIQUE INDEX "Candidate_slug_key" ON "Candidate"("slug");

-- CreateIndex
CREATE INDEX "Candidate_cycleId_idx" ON "Candidate"("cycleId");

-- CreateIndex
CREATE INDEX "Candidate_districtId_idx" ON "Candidate"("districtId");

-- CreateIndex
CREATE INDEX "Candidate_currentListId_idx" ON "Candidate"("currentListId");

-- CreateIndex
CREATE INDEX "Candidate_status_idx" ON "Candidate"("status");

-- CreateIndex
CREATE INDEX "Candidate_cycleId_districtId_idx" ON "Candidate"("cycleId", "districtId");

-- CreateIndex
CREATE INDEX "Affiliation_candidateId_idx" ON "Affiliation"("candidateId");

-- CreateIndex
CREATE INDEX "Affiliation_type_idx" ON "Affiliation"("type");

-- CreateIndex
CREATE INDEX "Affiliation_startDate_idx" ON "Affiliation"("startDate");

-- CreateIndex
CREATE INDEX "Affiliation_sourceId_idx" ON "Affiliation"("sourceId");

-- CreateIndex
CREATE UNIQUE INDEX "Topic_key_key" ON "Topic"("key");

-- CreateIndex
CREATE INDEX "Statement_candidateId_idx" ON "Statement"("candidateId");

-- CreateIndex
CREATE INDEX "Statement_topicId_idx" ON "Statement"("topicId");

-- CreateIndex
CREATE INDEX "Statement_sourceId_idx" ON "Statement"("sourceId");

-- CreateIndex
CREATE INDEX "Statement_occurredAt_idx" ON "Statement"("occurredAt");

-- CreateIndex
CREATE INDEX "Statement_candidateId_topicId_idx" ON "Statement"("candidateId", "topicId");

-- CreateIndex
CREATE INDEX "Source_originalUrl_idx" ON "Source"("originalUrl");

-- CreateIndex
CREATE INDEX "Source_archivedUrl_idx" ON "Source"("archivedUrl");

-- CreateIndex
CREATE INDEX "Source_archivedAt_idx" ON "Source"("archivedAt");

-- CreateIndex
CREATE INDEX "Source_archiveMethod_idx" ON "Source"("archiveMethod");

-- CreateIndex
CREATE INDEX "CandidateSubmission_candidateId_idx" ON "CandidateSubmission"("candidateId");

-- CreateIndex
CREATE INDEX "CandidateSubmission_status_idx" ON "CandidateSubmission"("status");

-- CreateIndex
CREATE INDEX "CandidateSubmission_submittedAt_idx" ON "CandidateSubmission"("submittedAt");

-- CreateIndex
CREATE INDEX "RightOfReply_candidateId_idx" ON "RightOfReply"("candidateId");

-- CreateIndex
CREATE INDEX "RightOfReply_status_idx" ON "RightOfReply"("status");

-- CreateIndex
CREATE INDEX "RightOfReply_submittedAt_idx" ON "RightOfReply"("submittedAt");

-- CreateIndex
CREATE INDEX "CorrectionRequest_candidateId_idx" ON "CorrectionRequest"("candidateId");

-- CreateIndex
CREATE INDEX "CorrectionRequest_status_idx" ON "CorrectionRequest"("status");

-- CreateIndex
CREATE INDEX "CorrectionRequest_createdAt_idx" ON "CorrectionRequest"("createdAt");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileVersion" ADD CONSTRAINT "ProfileVersion_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileVersion" ADD CONSTRAINT "ProfileVersion_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "ElectionCycle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectoralList" ADD CONSTRAINT "ElectoralList_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "ElectionCycle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ElectoralList" ADD CONSTRAINT "ElectoralList_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "ElectionCycle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Candidate" ADD CONSTRAINT "Candidate_currentListId_fkey" FOREIGN KEY ("currentListId") REFERENCES "ElectoralList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Affiliation" ADD CONSTRAINT "Affiliation_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Affiliation" ADD CONSTRAINT "Affiliation_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statement" ADD CONSTRAINT "Statement_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statement" ADD CONSTRAINT "Statement_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "Topic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Statement" ADD CONSTRAINT "Statement_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSubmission" ADD CONSTRAINT "CandidateSubmission_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RightOfReply" ADD CONSTRAINT "RightOfReply_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

