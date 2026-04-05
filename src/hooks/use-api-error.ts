import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";

export const useApiErrorToast = () => {
  const t = useTranslations("error");

  const handleError = (error: any, fallbackMessage?: string) => {
    if (error instanceof ApiError) {
      toast.error(error.getLocalizedMessage(t));
      return;
    }

    const message =
      error?.response?.data?.message ||
      error?.message ||
      fallbackMessage ||
      "Something went wrong";
    
    toast.error(message);
  };

  return { handleError };
};
