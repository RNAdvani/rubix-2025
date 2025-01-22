import { BottomNav } from "@/components/bottom-navbar";
import { Outlet } from "react-router";

export default function Dashboard() {
  return (
    <div className="pb-14 md:pb-0 md:grid md:grid-cols-[auto,1fr] md:gap-4">
      <BottomNav />
      <Outlet/>
    </div>
  );
}
