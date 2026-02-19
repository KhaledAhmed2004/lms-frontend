"use client";

import { LegalPage } from "../components/LegalPage";
import { POLICY_TYPE } from "@/hooks/api";

export default function LegalNotice() {
  return <LegalPage type={POLICY_TYPE.LEGAL_NOTICE} />;
}