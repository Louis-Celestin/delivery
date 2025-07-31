import { pageMap } from './pageRegistry';
import { useAuth } from './hooks/useAuth';

const DashboardRedirector = () => {
    const { role } = useAuth();
    const Page = pageMap[role];
    return <Page />;
  };

export default DashboardRedirector;