import { auth } from "@/lib/auth/auth";
import { AuthForm } from "@/modules/auth/components/auth-form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
