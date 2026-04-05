"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { useRegister } from "@/hooks/api";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

import { AuthNavbar } from "@/components/auth-navbar";

const RegisterPage = () => {
  const t = useTranslations("auth.register");
  const te = useTranslations("error");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToPolicy, setAgreeToPolicy] = useState(false);

  const { mutate: register, isPending } = useRegister();

  const handleRegister = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error(t("errorAllFields"));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t("errorPasswordMismatch"));
      return;
    }

    if (!agreeToPolicy) {
      toast.error(t("errorAgreePolicy"));
      return;
    }

    register(
      { name, email, password, role: "STUDENT" },
      {
        onSuccess: () => {
          toast.success(t("success"));
        },
        onError: (error: any) => {
          const message =
            error?.getLocalizedMessage?.(te) ||
            error?.message ||
            t("errorFallback");
          toast.error(message);
        },
      },
    );
  };
  return (
    <>
      <AuthNavbar />

      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-white">
        {!showForm ? (
          /* ===== Card Selection View ===== */
          <div className="w-full max-w-[800px] space-y-10">
            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("heading")}
            </h2>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Card 1: Trial Session */}
              <div className="border border-gray-200 rounded-xl p-8 flex flex-col items-center text-center space-y-5 hover:shadow-lg transition-shadow">
                <div className="w-36 h-36 rounded-full overflow-hidden">
                  <Image
                    src="/images/home/6.webp"
                    alt={t("trialSession")}
                    width={144}
                    height={144}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-gray-800 text-lg font-medium">
                  {t("trialSession")}
                </p>
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="bg-[#0B31BD] hover:bg-blue-800 text-white font-semibold py-2.5 px-10 rounded-lg text-base transition-colors"
                >
                  {t("requestButton")}
                </button>
              </div>

              {/* Card 2: Become a Tutor */}
              <div className="border border-gray-200 rounded-xl p-8 flex flex-col items-center text-center space-y-5 hover:shadow-lg transition-shadow">
                <div className="w-36 h-36 rounded-full overflow-hidden">
                  <Image
                    src="/images/home/7.webp"
                    alt={t("becomeTutor")}
                    width={144}
                    height={144}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-gray-800 text-lg font-medium">
                  {t("becomeTutor")}
                </p>
                <Link
                  href="/free-trial-teacher"
                  className="bg-[#6366F1] hover:bg-indigo-600 text-white font-semibold py-2.5 px-10 rounded-lg text-base transition-colors"
                >
                  {t("applyButton")}
                </Link>
              </div>
            </div>

            {/* Bottom Links */}
            <div className="text-center space-y-2">
              <p className="text-gray-700 text-sm">
                {t("hasAccount")}{" "}
                <Link
                  href="/login"
                  className="text-[#0B31BD] hover:text-blue-700 font-semibold"
                >
                  {t("login")}
                </Link>
              </p>
            </div>
          </div>
        ) : (
          /* ===== Registration Form View ===== */
          <div className="w-full max-w-[696px] space-y-8">
            {/* Back Button */}
            <button
              onClick={() => setShowForm(false)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("back")}
            </button>

            {/* Heading Section */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {t("createAccount")}
              </h2>
              <p className="text-gray-600 text-sm sm:text-base">
                {t("signUpSubtitle")}
              </p>
            </div>

            {/* Form Section */}
            <form
              onSubmit={handleRegister}
              className="space-y-6 flex flex-col items-stretch"
            >
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 block">
                  {t("fullNameLabel")}
                </label>
                <Input
                  type="text"
                  placeholder={t("fullNamePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-5 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-0 focus:outline-none"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 block">
                  {t("emailLabel")}
                </label>
                <Input
                  type="email"
                  placeholder={t("emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-5 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-0 focus:outline-none"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 block">
                  {t("passwordLabel")}
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t("passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-5 pr-12 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-0 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 block">
                  {t("confirmPasswordLabel")}
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("confirmPasswordPlaceholder")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-5 pr-12 border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-0 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Privacy Policy Checkbox */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="policy"
                  checked={agreeToPolicy}
                  onCheckedChange={(checked) =>
                    setAgreeToPolicy(checked === true)
                  }
                  className="border-gray-300"
                />
                <label
                  htmlFor="policy"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {t("agreePolicy")}{" "}
                  <Link
                    href="/privacy"
                    className="text-[#0B31BD] hover:underline font-medium"
                  >
                    {t("privacyPolicy")}
                  </Link>
                  {t("agreePolicySuffix") && ` ${t("agreePolicySuffix")}`}
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#0B31BD] hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {t("creatingAccount")}
                  </>
                ) : (
                  t("signUpButton")
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-700 text-sm">
                {t("hasAccount")}{" "}
                <Link
                  href="/login"
                  className="text-[#0B31BD] hover:text-blue-700 font-semibold"
                >
                  {t("login")}
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RegisterPage;
