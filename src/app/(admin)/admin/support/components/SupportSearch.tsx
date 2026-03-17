import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type SupportSearchProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function SupportSearch({ value, onChange }: SupportSearchProps) {
  return (
    <div className="relative w-1/3">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
      <Input
        placeholder="Search by ticket number, message..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10 pr-4 h-11 border border-gray-300 rounded-xl focus:ring-0 focus:border-gray-400"
      />
    </div>
  );
}
