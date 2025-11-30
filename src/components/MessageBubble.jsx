import React from 'react'
import { formatShort } from '../utils/date'

export default function MessageBubble({ message }){
  const isCustomer = message.sender === 'customer'
  const isBot = message.sender === 'bot'
  return (
    <div className={`max-w-[72%] ${isCustomer? 'ml-auto bg-brand-500 text-white' : 'bg-white border'} p-3 rounded-lg`}>
      <div className="text-sm">{message.message}</div>
      <div className="text-xs mt-2 text-slate-400">{formatShort(message.created_at)}</div>
      {isBot && <div className="text-xs mt-1 text-yellow-700">Auto-reply</div>}
    </div>
  )
}
