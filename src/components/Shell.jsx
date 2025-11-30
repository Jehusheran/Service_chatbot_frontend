import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

export default function Shell({ children }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
