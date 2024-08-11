import { Outlet } from "react-router-dom";

type DashboardPageProps = {};

export default function DashboardPage({}: DashboardPageProps) {
  return (
    <>
      <Outlet />
    </>
  );
}
