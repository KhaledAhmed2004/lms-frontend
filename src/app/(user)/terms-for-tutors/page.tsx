"use client";

import { LegalPage } from "../components/LegalPage";
import { POLICY_TYPE } from "@/hooks/api";

export default function TermsForTutors() {
  return <LegalPage type={POLICY_TYPE.TERMS_FOR_TUTORS} />;
}