"use client";

import { useState } from "react";
import { Phone, Mail, CalendarDays } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("contact");

  const contactInfo = [
    {
      icon: Phone,
      label: t("phone"),
      value: "+49 162 7477536",
      href: "tel:+491627477536",
    },
    {
      icon: Mail,
      label: t("email"),
      value: "support@schaefer-tutoring.com",
      href: "mailto:support@schaefer-tutoring.com",
    },
    {
      icon: CalendarDays,
      label: t("availability"),
      value: t("monSun"),
    },
  ];

  const topics = [
    t("topicGeneralInquiry"),
    t("topicFreeTrial"),
    t("topicPricing"),
    t("topicBecomeTutor"),
    t("topicTechSupport"),
    t("topicOther"),
  ];


  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    topic: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message) {
      toast.error(t("requiredFields"));
      return;
    }
    toast.success(t("messageSent"));
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      topic: "",
      message: "",
    });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Details Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 h-full">
              <h2 className="text-xl font-bold text-gray-900 mb-8">
                {t("contactDetails")}
              </h2>
              <div className="space-y-8">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#EEF1FD] flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-[#0B31BD]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{item.label}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-[#0B31BD] font-medium hover:underline"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-gray-900 font-medium">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {t("sendUsMessage")}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("firstName")}
                    </label>
                    <Input
                      type="text"
                      placeholder={t("firstNamePlaceholder")}
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t("lastName")}
                    </label>
                    <Input
                      type="text"
                      placeholder={t("lastNamePlaceholder")}
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("emailLabel")}
                  </label>
                  <Input
                    type="email"
                    placeholder={t("emailPlaceholder")}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t("message")}
                  </label>
                  <Textarea
                    rows={5}
                    placeholder={t("messagePlaceholder")}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#0B31BD] text-white py-3 h-12 rounded-lg font-medium hover:bg-[#062183]"
                >
                  {t("sendMessage")}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
