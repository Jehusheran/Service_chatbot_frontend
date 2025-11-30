import React from 'react'
import { motion } from 'framer-motion'
import { ChatBubbleLeftRightIcon, CalendarDaysIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

const items = [
  { id: 'convos', label: 'Conversations', icon: ChatBubbleLeftRightIcon },
  { id: 'bookings', label: 'Bookings', icon: CalendarDaysIcon },
  { id: 'reports', label: 'Reports', icon: DocumentTextIcon },
]

export default function Sidebar(){
  return (
    <aside className="w-72 p-6 border-r bg-white min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold">SC</div>
        <div>
          <div className="text-slate-900 font-semibold">ServiceChat</div>
          <div className="text-xs text-slate-500">Agent Console</div>
        </div>
      </div>

      <nav className="space-y-2">
        {items.map(it => (
          <motion.button key={it.id} whileHover={{scale:1.02}} className="w-full text-left flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50">
            <it.icon className="w-5 h-5 text-slate-600" />
            <span className="font-medium text-slate-700">{it.label}</span>
          </motion.button>
        ))}
      </nav>

      <div className="mt-8">
        <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">Quick Search</div>
        <input placeholder="Search customers or topics" className="w-full p-2 rounded border text-sm" />
      </div>
    </aside>
  )
}
