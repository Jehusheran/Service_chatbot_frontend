import React from 'react'
import { BellIcon } from '@heroicons/react/24/outline'

export default function Header(){
  return (
    <header className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold text-slate-800">Manager Dashboard</h1>
        <div className="text-sm text-slate-500">View summaries • manage threads • bookings</div>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 rounded hover:bg-slate-50"><BellIcon className="w-5 h-5 text-slate-600"/></button>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-700">Agent 1</div>
          <img src="https://i.pravatar.cc/40" className="w-8 h-8 rounded-full" alt="agent"/>
        </div>
      </div>
    </header>
  )
}
