import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useSetAtom } from "jotai";
import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getIcon } from "@/lib/icons";
import { deleteMatrixAtom } from "@/store/matrices";
import { X } from "lucide-react";

interface MatrixMenuItemProps {
  matrixId: string;
  title: string;
  iconName: string;
}

export function MatrixMenuItem({
  matrixId,
  title,
  iconName,
}: MatrixMenuItemProps) {
  const Icon = getIcon(iconName);
  const navigate = useNavigate();
  const params = useParams();
  const deleteMatrix = useSetAtom(deleteMatrixAtom);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [needsFade, setNeedsFade] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkTextOverflow = () => {
      if (textRef.current && containerRef.current) {
        const textWidth = textRef.current.scrollWidth;
        const containerWidth = containerRef.current.clientWidth;
        // Account for icon (16px) + gaps (12px) + button space when hovered (24px) + padding (12px)
        const availableWidth = containerWidth - (16 + 12 + (isHovered ? 24 : 0) + 12);
        setNeedsFade(textWidth > availableWidth);
      }
    };

    checkTextOverflow();
    window.addEventListener('resize', checkTextOverflow);
    return () => window.removeEventListener('resize', checkTextOverflow);
  }, [isHovered, title]);

  const handleDelete = () => {
    // If user is currently viewing this matrix, redirect to dashboard
    if (params.matrixId === matrixId) {
      navigate("/");
    }
    
    deleteMatrix(matrixId);
    setShowDeleteDialog(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  return (
    <>
      <SidebarMenuItem>
        <div 
          ref={containerRef}
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <SidebarMenuButton asChild>
            <Link
              to={`/${matrixId}`}
              className="!h-8 !px-3 flex items-center !gap-3 !w-full hover:bg-accent/50 transition-colors duration-200 overflow-hidden"
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span 
                ref={textRef}
                className={`text-sm font-medium truncate transition-all duration-200 ${
                  isHovered && needsFade
                    ? '[mask-image:linear-gradient(to_right,black_78%,transparent_95%)]' 
                    : ''
                }`}
              >
                {title}
              </span>
            </Link>
          </SidebarMenuButton>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteClick}
            className={`absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive cursor-pointer flex items-center justify-center ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </SidebarMenuItem>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Matrix</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
