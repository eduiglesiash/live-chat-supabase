import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { Login } from "~/components/Login";
import { RealTimeMessages } from "~/components/RealTimeMessage";
import { createSupabaseServerCLient } from "~/utils/supabase.server";


// loader de datos en el servidor
export const loader = async ({ request }: LoaderArgs) => {
  const response = new Response();
  const supabase = createSupabaseServerCLient({ request, response })
  const { data } = await supabase.from('messages').select()
  return json({ messages: data || [] }, { headers: response.headers })
}


// action, que es la función que se ejecuta cuando se hace 
// submit en el formulario del componente
export const action = async ({ request }: ActionArgs) => {
  const response = new Response()
  const supabase = createSupabaseServerCLient({ request, response })

  // formData de la request
  const formData = await request.formData()
  const { message } = Object.fromEntries(formData)

  await supabase.from('messages').insert({ content: String(message) })
  return json({ message: 'ok' }, { headers: response.headers })
}

export default function Index() {
  const { messages } = useLoaderData<typeof loader>()

  return (
    <main>
      <h1>Live Chat | Welly Code</h1>
      <Login />
      <Form method="post">
        <input type="text" name="message" />
        <button type="submit"> Enviar mensaje</button>
      </Form>

      <RealTimeMessages serverMessages={messages} />
      
    </main>
  );
}
