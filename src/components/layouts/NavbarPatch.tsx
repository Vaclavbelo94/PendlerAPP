
import { NotificationIndicator } from "../notifications/NotificationIndicator";

// This is a patch to add the notification indicator to the navbar
// Import this in Layout.tsx and pass it to the Navbar component as a prop
export const NavbarRightContent = () => {
  return <NotificationIndicator />;
};
