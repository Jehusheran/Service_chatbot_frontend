import React, { useState } from 'react'
import api from '../api'

export default function Login(){
  const [tab, setTab] = useState('agent')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')

  async function agentLogin(){
    try {
      const res = await api.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.access_token)
      window.location.href = '/dashboard'
    } catch { alert('Login failed') }
  }

  async function sendOtp(){
    await api.post('/auth/send_otp', { phone })
    alert('OTP sent')
  }

  async function verifyOtp(){
    try {
      const res = await api.post('/auth/verify_otp', { phone, code: otp })
      localStorage.setItem('token', res.data.access_token)
      window.location.href = '/dashboard'
    } catch { alert('Invalid OTP') }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-[900px] grid grid-cols-2 gap-6 p-8 bg-white rounded-xl shadow-lg">
        <div>
          <h2 className="text-2xl font-bold mb-4">ServiceChat — Sign in</h2>
          <div className="mb-4 text-slate-500">Choose agent or customer login</div>
          <div className="flex gap-2 mb-6">
            <button onClick={()=>setTab('agent')} className={`px-3 py-2 rounded ${tab==='agent' ? 'bg-brand-500 text-white' : 'bg-slate-100'}`}>Agent</button>
            <button onClick={()=>setTab('customer')} className={`px-3 py-2 rounded ${tab==='customer' ? 'bg-brand-500 text-white' : 'bg-slate-100'}`}>Customer</button>
          </div>

          {tab === 'agent' && (
            <div className="space-y-3">
              <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded" />
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" className="w-full p-2 border rounded" />
              <button onClick={agentLogin} className="w-full py-2 bg-brand-500 text-white rounded">Sign in</button>
            </div>
          )}

          {tab === 'customer' && (
            <div className="space-y-3">
              <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone (+91...)" className="w-full p-2 border rounded" />
              <div className="flex gap-2">
                <button onClick={sendOtp} className="px-3 py-2 bg-slate-200 rounded">Send OTP</button>
                <input value={otp} onChange={e=>setOtp(e.target.value)} placeholder="OTP" className="p-2 border rounded flex-1" />
                <button onClick={verifyOtp} className="px-3 py-2 bg-brand-500 text-white rounded">Verify</button>
              </div>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="font-semibold">Features</h3>
          <ul className="mt-3 space-y-2 text-slate-600">
            <li>• WhatsApp-style conversations (stored server-side)</li>
            <li>• Agent & Bot assist suggestions</li>
            <li>• Book, reschedule & cancel (Google Calendar)</li>
            <li>• OTP verification for customers (Twilio)</li>
            <li>• AI summaries with date ranges</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
