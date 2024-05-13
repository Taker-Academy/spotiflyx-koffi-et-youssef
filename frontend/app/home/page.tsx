import { redirect } from "next/navigation";
import { checkToken } from "@/components/checkToken";

export default async function Home() {
  const isAuthorized = await checkToken();

  if (!isAuthorized) {
    redirect("/auth/login");
  }
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the home page!</p>
    </div>
  );
}
