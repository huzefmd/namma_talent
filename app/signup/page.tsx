import { Suspense } from "react";
import AuthHeader from "@/components/AuthHeader";
import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <>
      <AuthHeader />
      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>
    </>
  );
}