import { useAtomValue } from "jotai";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Plus, Search, Settings, BarChart3 } from "lucide-react";
import { MatrixMenuItem } from "@/components/MatrixMenuItem";
import { recentMatricesAtom } from "@/store/matrices";

// Helper function to format dates as relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks === 1) return "1 week ago";
  if (diffWeeks < 4) return `${diffWeeks} weeks ago`;
  if (diffMonths === 1) return "1 month ago";
  return `${diffMonths} months ago`;
}

export function AppSidebar() {
  const recentMatrices = useAtomValue(recentMatricesAtom);

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-1">
          <BarChart3 className="h-6 w-6" />
          <span className="font-semibold">Decision Matrix</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <Plus className="h-4 w-4" />
                    <span>New Matrix</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#">
                    <Search className="h-4 w-4" />
                    <span>Search Matrices</span>
                  </a>
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
                  lastAccessed={formatRelativeTime(matrix.lastAccessed)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
