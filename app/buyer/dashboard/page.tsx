import AuthHeader from "@/components/AuthHeader";
import BuyerDashboardClient from "./BuyerDashboardInner";

export default function BuyerDashboardPage() {
  return (
    <>
      <AuthHeader />
      <BuyerDashboardClient />
    </>
  );
}