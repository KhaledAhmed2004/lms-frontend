"use client";

import { LegalPage } from "../components/LegalPage";
import { POLICY_TYPE } from "@/hooks/api";

export default function Terms() {
  return <LegalPage type={POLICY_TYPE.TERMS_FOR_STUDENTS} />;
}