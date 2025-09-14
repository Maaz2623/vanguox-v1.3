import { createTRPCRouter } from "../init";
import { chatRouter } from "./procedures/chat.procedure";
export const appRouter = createTRPCRouter({
  chats: chatRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
