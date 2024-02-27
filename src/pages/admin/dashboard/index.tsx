import MainLayout from "~/layout/main";

export default function AdminDashboard() {
  return (
    <section>
      <h1>Welcome to Admin Dashboard</h1>
    </section>
  );
}

AdminDashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <MainLayout title="Dashboard">{page}</MainLayout>;
};
