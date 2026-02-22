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

const contactInfo = [
  {
    icon: Phone,
    label: "Phone",
    value: "+49 162 7477536",
    href: "tel:+491627477536",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@schaefer-tutoring.com",
    href: "mailto:info@schaefer-tutoring.com",
  },
  {
    icon: CalendarDays,
    label: "Availability",
    value: "Mon \u2013 Fri, 9 am \u2013 6 pm",
  },
];

const topics = [
  "General Inquiry",
  "Free Trial Session",
  "Pricing & Plans",
  "Become a Tutor",
  "Technical Support",
  "Other",
];

export default function ContactPage() {
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
      toast.error("Please fill in all required fields.");
      return;
    }
    toast.success("Message sent! We'll get back to you soon.");
    setFormData({ firstName: "", lastName: "", email: "", topic: "", message: "" });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gray-50 py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Contact Details Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 h-full">
              <h2 className="text-xl font-bold text-gray-900 mb-8">Contact Details</h2>
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
                        <p className="text-gray-900 font-medium">{item.value}</p>
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
              <h2 className="text-xl font-bold text-gray-900 mb-2">Send us a message</h2>
              <p className="text-sm text-gray-500 mb-8">
                Fill in the form and we&apos;ll get back to you as soon as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      First Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Anna"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Last Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Müller"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="anna@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Topic
                  </label>
                  <Select
                    value={formData.topic}
                    onValueChange={(value) =>
                      setFormData({ ...formData, topic: value })
                    }
                  >
                    <SelectTrigger className="h-10 w-full">
                      <SelectValue placeholder="Select a topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {topics.map((topic) => (
                        <SelectItem key={topic} value={topic}>
                          {topic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Message
                  </label>
                  <Textarea
                    rows={5}
                    placeholder="How can we help you?"
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
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
