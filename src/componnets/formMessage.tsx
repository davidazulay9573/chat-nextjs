'use client'
import { sendMessage } from "@/app/chat/server-actions"

export default function FormMessage({ socket }: { socket: any }){
    return (
     <form action={(formData) => sendMessage(formData, socket)} className="flex flex-col space-y-4 p-4">
      <textarea
        name="message"
        className="p-2 border rounded-md border-gray-300 focus:border-blue-500 focus:outline-none"
        placeholder="Type your message here..."
      ></textarea>
      <button
        type="submit"
        className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Send Message
      </button>
    </form>
    )
}