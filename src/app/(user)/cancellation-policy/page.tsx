"use client";

import { LegalPage } from "../components/LegalPage";
import { POLICY_TYPE } from "@/hooks/api";

export default function CancellationPolicy() {
  return <LegalPage type={POLICY_TYPE.CANCELLATION_POLICY} />;
}