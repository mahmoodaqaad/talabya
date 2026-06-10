import { redirect } from "next/navigation";
import Dashboard from "./dashboard/page";


export default function Home() {
  redirect("/dashboard")
  return (
    <div><Dashboard /></div>
  );
}


