import { LayoutDashboard, Smartphone, Users, Monitor, FileText, Bell, X, ChevronLeft, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useNotificationsStore } from "@/stores/notificationsStore";
import { useAuthStore } from "@/stores/authStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Requests", icon: FileText, path: "/requests" },
  { name: "CSM", icon: Smartphone, path: "/manage-user-app" },
  { name: "Agents", icon: Users, path: "/agents" },
  { name: "Notifications", icon: Bell, path: "/notifications", showBadge: true },
];

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AdminSidebar({ isOpen = false, onClose, isCollapsed = false, onToggleCollapse }: AdminSidebarProps) {
  const { items } = useNotificationsStore();
  const { user } = useAuthStore();
  const unreadCount = items.filter(item => !item.read).length;

  // Generate initials from user name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "bg-sidebar text-sidebar-foreground flex flex-col h-screen border-r border-gray-400 dark:border-gray-600 transition-all duration-300 ease-in-out z-50 relative",
        // Desktop: fixed positioning to prevent scrolling with content
        "md:fixed md:top-0 md:left-0 md:translate-x-0",
        // Mobile: fixed positioning with transform
        "fixed top-0 left-0",
        isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        // Width based on collapsed state
        isCollapsed ? "md:w-16 w-64" : "w-64"
      )}>


        {/* Mobile close button */}
        <div className="md:hidden flex justify-end p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Logo */}
        <div className={cn(
          "p-6 flex items-center gap-3 transition-all duration-300",
          isCollapsed && "md:justify-center md:px-2"
        )}>
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Monitor className="w-6 h-6 text-primary-foreground" />
          </div>
          <div className={cn(
            "transition-all duration-300",
            isCollapsed && "md:hidden"
          )}>
            <h1 className="text-lg font-bold tracking-tight">ICON</h1>
            <p className="text-xs text-sidebar-foreground/70">COMPUTERS</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose} // Close mobile sidebar on navigation
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 relative min-h-[44px]",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isCollapsed && "md:justify-center md:px-2"
                )
              }
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className={cn(
                "font-medium transition-all duration-300",
                isCollapsed && "md:hidden"
              )}>
                {item.name}
              </span>
              {item.showBadge && unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className={cn(
                    "ml-auto h-5 px-1.5 text-xs transition-all duration-300",
                    isCollapsed && "md:absolute md:top-1 md:right-1 md:ml-0"
                  )}
                >
                  {unreadCount}
                </Badge>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Desktop collapse toggle button */}
        <div className="relative h-10">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className={cn(
              "absolute -right-3 -top-2 z-10 h-10 w-6 rounded-full bg-background border border-border shadow-md hover:bg-accent hidden md:flex items-center justify-center",
              "transition-all duration-300"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-3 w-3" />
            ) : (
              <ChevronLeft className="h-3 w-3" />
            )}
          </Button>
        </div>

        {/* Profile Section */}
        <div className="p-4 border-t border-sidebar-border">
          <div className={cn(
            "flex items-center gap-3 px-2 py-2 min-h-[44px] transition-all duration-300",
            isCollapsed && "md:justify-center md:px-1"
          )}>
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-semibold text-primary-foreground">
                {user ? getInitials(user.name) : 'AU'}
              </span>
            </div>
            <div className={cn(
              "flex-1 min-w-0 transition-all duration-300",
              isCollapsed && "md:hidden"
            )}>
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-sidebar-foreground/50 truncate">
                {user?.email || 'admin@iconcomputers.com'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
