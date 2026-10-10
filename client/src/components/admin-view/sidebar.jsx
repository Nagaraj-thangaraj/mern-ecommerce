

import {
  BadgeCheck,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import { Fragment } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <LayoutDashboard className="h-5 w-5 shrink-0" />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket className="h-5 w-5 shrink-0" />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck className="h-5 w-5 shrink-0" />,
  },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="mt-6 flex flex-col gap-1.5">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = pathname.startsWith(menuItem.path);

        return (
          <button
            key={menuItem.id}
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={() => {
              navigate(menuItem.path);
              if (setOpen) setOpen(false);
            }}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 lg:text-lg ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
            }`}
          >
            {menuItem.icon}
            <span className="truncate">{menuItem.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function AdminSideBar({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile / tablet: slide-in drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-[80vw] max-w-xs overflow-y-auto p-4 sm:p-6"
        >
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b pb-4">
              <SheetTitle className="flex items-center gap-2">
                <ChartNoAxesCombined size={28} className="text-primary" />
                <span className="text-xl font-extrabold sm:text-2xl">
                  Admin Panel
                </span>
              </SheetTitle>
              <SheetDescription className="sr-only">
                Admin navigation menu
              </SheetDescription>
            </SheetHeader>
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop: fixed sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col overflow-y-auto border-r bg-background p-6 lg:flex">
        <button
          type="button"
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 border-b pb-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <ChartNoAxesCombined size={30} className="text-primary" />
          <span className="text-2xl font-extrabold">Admin Panel</span>
        </button>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSideBar;
