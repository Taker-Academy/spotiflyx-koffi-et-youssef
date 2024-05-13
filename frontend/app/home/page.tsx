import { redirect } from "next/navigation";
import { checkToken } from "@/src/checkToken";

export default async function Home() {
  const isAuthorized = await checkToken();

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the home page!</p>
    </div>
  );
}
