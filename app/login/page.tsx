import { Suspense } from "react";
import AuthHeader from "@/components/AuthHeader";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <>
      <AuthHeader />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </>
  );
}