"use client";

import { useState } from "react";
import { FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "@/i18n/routing";
import { useLogin } from "@/hooks/api";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { AuthNavbar } from "@/components/auth-navbar";

const LoginPage = () => {
  const t = useTranslations("auth.login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberPassword, setRememberPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: login, isPending } = useLogin();

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error(t("errorEmpty"));
      return;
    }

    login(
      { email, password },
      {
        onSuccess: () => {
          toast.success(t("success"));
        },
        onError: (error: any) => {
          const message =
            error?.getFullMessage?.() ||
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

      {/* Login Container */}
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 py-12 bg-white">
        <div className="w-full max-w-[696px] space-y-8">
          {/* Heading Section */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {t("title")}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {t("subtitle")}
            </p>
          </div>

          {/* Form Section */}
          <form
            onSubmit={handleLogin}
            className="space-y-6 flex flex-col items-stretch"
          >
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

                {/* Eye Toggle Button */}
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

            {/* Remember Password & Forgot Password */}
            <div className="flex items-center justify-between w-full gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberPassword}
                  onCheckedChange={(checked) =>
                    setRememberPassword(checked === true)
                  }
                  className="border-gray-300"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {t("rememberMe")}
                </label>
              </div>
              <div>
                <Link
                  href="/reset"
                  className="text-sm text-[#0B31BD] hover:text-[#0B31BD] hover:underline font-medium"
                >
                  {t("forgotPassword")}
                </Link>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#0B31BD] hover:bg-blue-800 text-white font-semibold py-2.5 rounded-lg text-base transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t("loggingIn")}
                </>
              ) : (
                t("button")
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-700 text-sm">
              {t("noAccount")}{" "}
              <Link
                href="/register"
                className="text-[#0B31BD] hover:text-blue-700 font-semibold"
              >
                {t("signUp")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
