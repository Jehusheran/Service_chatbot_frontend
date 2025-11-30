import React, { useState } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'

export default function Composer({ onSend }){
  const [text, setText] = useState('')
  const sending = false

  async function submit(e){
    e.preventDefault()
    if (!text.trim()) return
    await onSend(text.trim())
    setText('')
  }

  return (
    <form onSubmit={submit} className="mt-3 composer p-3 bg-slate-50 rounded flex items-center gap-3">
      <input value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message — press Enter to send" className="flex-1 bg-transparent outline-none" />
      <button type="submit" className="p-2 bg-brand-500 rounded text-white">
        <PaperAirplaneIcon className="w-4 h-4 rotate-45" />
      </button>
    </form>
  )
}
