-- CreateTable
CREATE TABLE "Medicion" (
    "id" SERIAL NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "temperatura" DOUBLE PRECISION NOT NULL,
    "humedad" DOUBLE PRECISION NOT NULL,
    "consumoKwh" DOUBLE PRECISION NOT NULL,
    "corrienteRms" DOUBLE PRECISION NOT NULL,
    "calidadAire" INTEGER NOT NULL,

    CONSTRAINT "Medicion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Medicion_timestamp_idx" ON "Medicion"("timestamp");
