import { createTRPCRouter } from "../init";
import { chatRouter } from "./procedures/chat.procedure";
import { subscriptionRouter } from "./procedures/subscription.procedure";
import { usageRouter } from "./procedures/usage.procedure";
export const appRouter = createTRPCRouter({
  chats: chatRouter,
  subscription: subscriptionRouter,
  usage: usageRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
