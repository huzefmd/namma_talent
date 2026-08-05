import AuthHeader from "@/components/AuthHeader";
import ListerDashboardClient from "./ListerDashboardClient";

export default function ListerDashboardPage() {
  return (
    <>
      <AuthHeader />
      <ListerDashboardClient />
    </>
  );
}