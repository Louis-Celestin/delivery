
import { layoutMap } from './layoutRegistry';
import { pageMap } from './pageRegistry';
import { useAuth } from './hooks/useAuth'; // hypothetical auth hook
import { Outlet } from 'react-router';

const AdminRenderer = () => {
  const { role } = useAuth(); // 'super', 'regional', etc.
  console.log('Detected role:', role);

  const Layout = layoutMap[role];

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default AdminRenderer;
