"use client";

import { LegalPage } from "../components/LegalPage";
import { POLICY_TYPE } from "@/hooks/api";

export default function Privacy() {
  return <LegalPage type={POLICY_TYPE.PRIVACY_POLICY} />;
}