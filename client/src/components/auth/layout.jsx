


import { Outlet } from "react-router-dom";
import logo from "../../assets/Auth.png"; // image ah inga save pannunga

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      {/* Brand panel: mobile/tablet la top banner, desktop la left half */}
      <div className="flex items-center justify-center bg-primary px-6 py-10 lg:w-1/2 lg:px-12 lg:py-0">
        <div className="max-w-md space-y-4 text-center text-primary-foreground">
          <img
            src={logo}
            alt="Shopzy"
            className="mx-auto h-20 w-auto sm:h-24 lg:h-32"
          />
          <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl lg:text-4xl">
            Welcome to ECommerce Shopping
          </h1>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;