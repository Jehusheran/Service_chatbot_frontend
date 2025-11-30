import React, { useState } from 'react'
import api from '../api'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { motion } from 'framer-motion'

export default function SummaryPanel({ customerId, agentId }){
  const [start, setStart] = useState(new Date(Date.now() - 30*24*3600*1000))
  const [end, setEnd] = useState(new Date())
  const [sentences, setSentences] = useState(3)
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState(null)

  async function generate(force=false){
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('start', start.toISOString())
      params.set('end', end.toISOString())
      params.set('sentences', String(sentences))
      if (force) params.set('force', 'true')
      const res = await api.get(`/summary/${customerId}?${params.toString()}`)
      setSummary(res.data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  return (
    <div className="glass p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div className="font-semibold">AI Summary</div>
        <div className="text-xs text-slate-400">Date range</div>
      </div>
      <div className="grid grid-cols-1 gap-2">
        <DatePicker selected={start} onChange={d=>setStart(d)} className="p-2 border rounded" />
        <DatePicker selected={end} onChange={d=>setEnd(d)} className="p-2 border rounded" />
        <div className="flex items-center gap-2">
          <input type="number" min="1" max="6" value={sentences} onChange={e=>setSentences(Number(e.target.value))} className="p-2 border rounded w-20"/>
          <button onClick={()=>generate(false)} className="px-3 py-2 bg-brand-500 text-white rounded">Generate</button>
          <button onClick={()=>generate(true)} className="px-3 py-2 border rounded">Force</button>
        </div>
      </div>

      <div className="mt-3">
        {loading && <div className="text-sm text-slate-500">Generating…</div>}
        {summary && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}>
            <div className="text-xs text-slate-400">Messages: {summary.message_count} • Generated: {new Date(summary.generated_at).toLocaleString()}</div>
            <ul className="mt-2 space-y-2">
              {summary.sentences.map((s,i)=> <li key={i} className="p-2 bg-white rounded shadow-sm text-sm">{s}</li>)}
            </ul>
            <div className="text-xs text-slate-400 mt-2">Topics: {summary.topics?.join(', ')} • Sentiment: {summary.sentiment}</div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
