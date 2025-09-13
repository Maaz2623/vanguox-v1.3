export async function POST(req: Request) {
  const { messages, model, chatId } = await req.json();
}
