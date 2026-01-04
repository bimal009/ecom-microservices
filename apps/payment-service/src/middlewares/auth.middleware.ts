import { getAuth } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";

type Env = {
  Variables: {
    userId: string;
  };
};

export const shouldBeUser = createMiddleware<Env>(async (c, next) => {
  const auth = getAuth(c);
  const userId = auth?.userId;

  if (!userId) {
    return c.json({ message: "Unauthorized" }, 401);
  }

  c.set("userId", userId);

  await next();
});