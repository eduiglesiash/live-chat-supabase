import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Login } from "~/components/login";
import { createSupabaseServerCLient } from "~/utils/supabase.server";


// loader de datos en el servidor
export const loader = async ({ request }: LoaderArgs) => {

  const response = new Response();
  const supabase = createSupabaseServerCLient({ request, response })

  const { data } = await supabase.from('messages').select()
  return json({ messages: data || [] }, { headers: response.headers })
}

export default function Index() {
  const { messages } = useLoaderData<typeof loader>()

  return (
    <main>
      <h1>Live Chat | Welly Code</h1>
      <Login />
      <pre>
        {JSON.stringify(messages, null, 2)}
      </pre>
    </main>
  );
}
