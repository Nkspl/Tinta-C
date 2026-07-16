import TintaApp from "./TintaApp";
import Login from "./Login";
import { getChatGPTUser } from "./chatgpt-auth";

export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getChatGPTUser();
  if (!user) return <Login />;
  return <TintaApp identity={{ displayName: user.displayName, email: user.email }} />;
}
