import { withAuth } from "@repo/auth/middleware";
export default withAuth;
export const config = {
  matcher: ["/setup(.*)"],
};
