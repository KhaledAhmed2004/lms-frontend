"use client";

import { LegalPage } from "../components/LegalPage";
import { POLICY_TYPE } from "@/hooks/api";

export default function CookiePolicy() {
  return <LegalPage type={POLICY_TYPE.COOKIE_POLICY} />;
}