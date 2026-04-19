import { createBrowserRouter, RouterProvider } from "react-router";
import AuthLayout from "../components/layout/authLayout/authLayout";
import LoginForm from "../components/auth/loginForm";
import AdminPage from "../components/layout/adminLayout/adminLayout";
import Dashboard from "../pages/admin/dashboardPage";
import NotFoundPage from "../pages/not-found-page";
import BookingsPage from "../pages/admin/bookingPage";
import RegisterForm from "../components/auth/registerForm";

import { Toaster } from "sonner";
import ManageBus from "../pages/admin/manageBus";
import AddBus from "../pages/admin/addBus";
import Activate from "../components/auth/activate";
import Users from "../pages/admin/users";
import viewRoutes from "../pages/admin/viewRoutes";
import DriverPage from "../components/layout/adminLayout/driverLayout";
import DriverDashboard from "../pages/driver/dashboardPage";
import { AuthProvider } from "../context/auth.context";
import DriverBusPage from "../pages/driver/driverBusPage";
import DriverTripPage from "../pages/driver/driverTripPage";
import CreateTripPage from "../pages/driver/addTrip";
import DriverSeatReservation from "../pages/driver/driverSeatReservation";
import PaymentVerify from "../pages/payment/verify.payment";
import ChatPage from "../pages/chat/chat.page";
import BannerPage from "../pages/admin/banner";
import AddBanner from "../components/Admin/addBanner";
import updateBanner from "../components/Admin/updateBannner";
// import AdminOfferPage from "../pages/admin/addPromo";
import PromoListPage from "../pages/admin/getAllPromos";
import AdminOfferPages from "../pages/admin/addPromo";
import AdminBookingPage from "../pages/admin/bookingPage";
import DriverBookingPage from "../pages/driver/bookingPage";
import BookingDetailPage from "../pages/driver/bookingDetailPage";
import ChangePassword from "../components/changePassword";
import userProfile from "../components/userProfile";
import UpdateTripPage from "../pages/driver/updateTripPage";
import ForgotPasswordPage from "../components/auth/forget-password";
import AddBusByDriver from "../pages/driver/addBus";
import UserDetail from "../pages/admin/userDetail";
import BusUpdatePage from "../pages/admin/busUpdate";


const routerConfig = createBrowserRouter([
  {
    path: "/",
    Component: AuthLayout,
    children: [
      { index: true, Component: LoginForm },
      { path: "register", Component: RegisterForm },
      { path: "forget-password", Component: ForgotPasswordPage },
      { path: "activate", Component: Activate },
    
    ],
  },
  {
    path: "/payment/verify",
    Component: PaymentVerify,
  },
  {
    path: "/admin",
    Component: AdminPage,
    children: [
      { index: true, Component: Dashboard },
      { path: "bookings", Component: BookingsPage },
      { path: "manage-buses", Component: ManageBus },
      { path: "manage-buses/add-bus", Component: AddBus },
      { path: "manage-buses/edit-bus/:id", Component: BusUpdatePage },
      { path: "manage-buses/view-routes/:busId", Component: viewRoutes },
      { path: "banners/add-banner", Component: AddBanner },
      { path: "banners/update/:_id", Component: updateBanner },
      { path: "banners", Component: BannerPage },
      { path: "booking", Component: AdminBookingPage },
      { path: "settings/profile", Component: userProfile },
      { path: "settings/password", Component: ChangePassword },
      { path: "promos", Component: PromoListPage },
      { path: "promos/add-promo", Component: AdminOfferPages },
      { path: "users", Component: Users },
      { path: "users/:id", Component: UserDetail },
      { path: "chat", Component: ChatPage },
    ],
  },
  {
    path: "/driver",
    Component: DriverPage,
    children: [
      {
        index: true,
        element: <DriverDashboard />,
      },
      { path: "my-bus", Component: DriverBusPage },
      { path: "trip/edit/:tripId", Component: UpdateTripPage },
      { path: "add-bus", Component: AddBusByDriver },
      { path: "settings/profile", Component: userProfile },
      { path: "settings/password", Component: ChangePassword },
      { path: "trip-update/:busId", Component: DriverTripPage },
      { path: "booking", Component: DriverBookingPage },
      { path: "bookings/:_id", Component: BookingDetailPage },
      { path: "add-trip/:busId", Component: CreateTripPage },
      { path: "seat-reservation/:tripId", Component: DriverSeatReservation },
      { path: "chat", Component: ChatPage },
    ],
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);

const RouterConfig = () => {
  return (
    <>
      <AuthProvider>
        <Toaster richColors closeButton />
        <RouterProvider router={routerConfig} />
      </AuthProvider>
    </>
  );
};
export default RouterConfig;
