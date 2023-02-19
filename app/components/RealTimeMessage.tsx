import { useSupabase } from "~/hooks/useSupabase";
import { useEffect, useState } from "react";
import type { Database } from "~/types/database";

type Message = Database['public']['Tables']['messages']['Row']

export function RealTimeMessages({
  serverMessages
}: {
  serverMessages: Message[]
}) {
  const [messages, setMessages] = useState<Message[]>(serverMessages)
  const supabase = useSupabase()

  useEffect(() => {
    const channel = supabase
      .channel('*')
      .on(
        'postgres_changes', // Broadcast
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        }, // Filter
        (payload) => { // callback
          const newMessages = payload.new as Message
          // if (!messages.some(message => message.id === newMessages.id)) {
          //    setMessages((messages) => [...messages, newMessages])
          // }
          setMessages((messages) => [...messages, newMessages])
        }).subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  return (
    <>
      <pre>
        {JSON.stringify(messages, null, 2)}
      </pre>
    </>
  )

}