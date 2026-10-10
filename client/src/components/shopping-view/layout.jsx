

import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";

function ShoppingLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ShoppingHeader />
      <main className="flex w-full flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;