import { redirect } from "next/navigation";
import { getUserSession } from "../../../src/actions/auth/getUserSession";


export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const response = await getUserSession();
  if(response?.user) {
    redirect("/");
  }
  return <>{children}</>;
}
