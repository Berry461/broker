import { redirect } from "next/navigation";
import { getUserSession } from "../../../src/actions/auth/getUserSession";



export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserSession();
  if (user) {
    redirect("/");
  }
  return <>{children}</>;
}
