import { Link } from "react-router";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { getIcon } from "@/lib/icons";

interface MatrixMenuItemProps {
  matrixId: string;
  title: string;
  iconName: string;
  lastAccessed: string;
}

export function MatrixMenuItem({
  matrixId,
  title,
  iconName,
  lastAccessed,
}: MatrixMenuItemProps) {
  const Icon = getIcon(iconName);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link
          to={`/${matrixId}`}
          className="!h-auto !p-2 flex flex-col items-start !gap-0"
        >
          <div className="flex items-center gap-2 w-full">
            <Icon className="h-4 w-4 shrink-0" />
            <span className="font-medium text-sm">{title}</span>
          </div>
          <span className="text-xs text-muted-foreground ml-6">
            {lastAccessed}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
