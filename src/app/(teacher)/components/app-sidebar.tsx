// "use client";

// import * as React from "react";
// import Link from "next/link";

// import { NavMain } from "@/components/sidebar/nav-main";
// import { NavUser } from "@/components/sidebar/nav-user";
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar";
// import { useAuthStore } from "@/store/auth-store";

// const navMain = [
//   { title: "Sessions", url: "/teacher/overview" },
//   { title: "Requests", url: "/teacher/requests" },
//   { title: "Messages", url: "/teacher/messages" },
//   { title: "Resources", url: "/teacher/resources" },
//   { title: "Earnings", url: "/teacher/earnings" },
//   { title: "Support", url: "/teacher/support" },
// ];

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   const { user } = useAuthStore();

//   const userData = {
//     name: user?.name || "Teacher",
//     email: user?.email || "",
//     avatar: user?.avatar || undefined,
//   };

//   return (
//     <Sidebar collapsible="offcanvas" {...props}>
//       <SidebarHeader>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton
//               asChild
//               className="data-[slot=sidebar-menu-button]:!p-1.5 bg-gray-100"
//             >
//               <Link href="/teacher/overview">
//                 <span className="text-xl font-semibold text-[#0B31BD]">
//                   Schäfer Tutoring
//                 </span>
//               </Link>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>
//       <SidebarContent>
//         <NavMain items={navMain} />
//       </SidebarContent>
//       <SidebarFooter className="md:hidden">
//         <NavUser user={userData} />
//       </SidebarFooter>
//     </Sidebar>
//   );
// }

"use client";

import * as React from "react";
import Link from "next/link";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/store/auth-store";

const navMain = [
  { title: "Sessions", url: "/teacher/overview" },
  { title: "Requests", url: "/teacher/requests" },
  { title: "Messages", url: "/teacher/messages" },
  { title: "Resources", url: "/teacher/resources" },
  { title: "Earnings", url: "/teacher/earnings" },
  { title: "Support", url: "/teacher/support" },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuthStore();

  const userData = {
    name: user?.name || "Teacher",
    email: user?.email || "",
    avatar: user?.avatar || undefined,
  };

  return (
    <Sidebar collapsible="offcanvas" className="bg-white" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <span className="text-[26px] font-semibold text-[#0B31BD] px-4">
            Schäfer Tutoring
          </span>
          {/* <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5 bg-gray-100 cursor-default">
              <span className="text-xl font-semibold text-[#0B31BD]">
                Schäfer Tutoring
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem> */}
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter className="md:hidden">
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
