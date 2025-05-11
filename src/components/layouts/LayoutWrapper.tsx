
import Layout from "./Layout";
import { NavbarRightContent } from "./NavbarPatch";

// Wraps the original Layout component with additional props
interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
  return (
    <Layout navbarRightContent={<NavbarRightContent />}>
      {children}
    </Layout>
  );
};

export default LayoutWrapper;
