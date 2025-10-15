import { auth } from "@/lib/auth/auth";
import { AuthForm } from "@/modules/auth/components/auth-form";
import { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Signin | Vanguox",
  description: "Signin to use",
};

const AuthPage = async () => {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (data) {
    redirect(`/`);
  }

  return <AuthForm />;
};

export default AuthPage;
