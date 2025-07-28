import { useAtomValue } from "jotai";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Plus,
  HelpCircle,
  BarChart3,
  Building,
  FileText,
  FileInput,
} from "lucide-react";
import { Link } from "react-router";
import { MatrixMenuItem } from "@/components/MatrixMenuItem";
import { recentMatricesAtom } from "@/store/matrices";

export function AppSidebar() {
  const recentMatrices = useAtomValue(recentMatricesAtom);

  return (
    <Sidebar>
      <div className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
        <BarChart3 className="h-6 w-6" />
        <span className="font-semibold">Decision Matrix</span>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/new"
                    className="!h-8 !px-3 flex items-center !gap-3 !w-full hover:bg-accent/50 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">New Matrix</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/new?template=true"
                    className="!h-8 !px-3 flex items-center !gap-3 !w-full hover:bg-accent/50 transition-colors duration-200"
                  >
                    <FileText className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">New Template</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/templates"
                    className="!h-8 !px-3 flex items-center !gap-3 !w-full hover:bg-accent/50 transition-colors duration-200"
                  >
                    <Building className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">View Templates</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/import"
                    className="!h-8 !px-3 flex items-center !gap-3 !w-full hover:bg-accent/50 transition-colors duration-200"
                  >
                    <FileInput className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">Import Matrix</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to="/"
                    className="!h-8 !px-3 flex items-center !gap-3 !w-full hover:bg-accent/50 transition-colors duration-200"
                  >
                    <HelpCircle className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">Help</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Recent Matrices</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recentMatrices.map((matrix) => (
                <MatrixMenuItem
                  key={matrix.id}
                  matrixId={matrix.id}
                  title={matrix.title}
                  iconName={matrix.icon}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
