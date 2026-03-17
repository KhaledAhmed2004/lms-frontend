import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterConfig = {
  key: string;
  label: string;
  options: FilterOption[];
};

type ExportCardProps = {
  icon: React.ElementType;
  iconBgColor: string;
  iconColor: string;
  title: string;
  description: string;
  filters: FilterConfig[];
  onExport: (filterValues: Record<string, string>) => void;
  isPending: boolean;
};

export default function ExportCard({
  icon: Icon,
  iconBgColor,
  iconColor,
  title,
  description,
  filters,
  onExport,
  isPending,
}: ExportCardProps) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value === "all" ? "" : value,
    }));
  };

  const handleExport = () => {
    const cleanParams: Record<string, string> = {};
    Object.entries(filterValues).forEach(([k, v]) => {
      if (v) cleanParams[k] = v;
    });
    onExport(cleanParams);
  };

  return (
    <Card className="border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start gap-3">
          <div className={`${iconBgColor} p-2.5 rounded-full shrink-0`}>
            <Icon className={iconColor} size={22} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          </div>
        </div>

        {filters.length > 0 ? (
          <div className="space-y-2">
            {filters.map((filter) => (
              <Select
                key={filter.key}
                value={filterValues[filter.key] || "all"}
                onValueChange={(val) => handleFilterChange(filter.key, val)}
              >
                <SelectTrigger className="w-full h-9 text-sm">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {filter.label}</SelectItem>
                  {filter.options.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        ) : null}

        <Button
          onClick={handleExport}
          disabled={isPending}
          className="w-full bg-[#002AC8] hover:bg-[#0022A0] text-white"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          {isPending ? "Downloading..." : "Download CSV"}
        </Button>
      </CardContent>
    </Card>
  );
}
