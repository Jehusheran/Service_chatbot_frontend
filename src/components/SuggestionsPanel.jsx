import React, { useEffect, useState } from 'react'
import api from '../api'
import { motion } from 'framer-motion'

export default function SuggestionsPanel({ customerId, agentId }){
  const [suggestions, setSuggestions] = useState([])

  useEffect(()=> { loadSuggestions() }, [customerId, agentId])

  async function loadSuggestions(){
    try {
      const res = await api.get(`/chat/history/${customerId}/${agentId}`)
      const msgs = res.data.messages || []
      const suggs = msgs.filter(m => m.meta && m.meta.bot_suggestion && !m.meta.used_by_agent)
      setSuggestions(suggs)
    } catch (e) { console.error(e) }
  }

  async function useSuggestion(id){
    try {
      await api.post('/chat/suggestion/use', { suggestion_message_id: id, agent_id: agentId, send_as: 'agent' })
      loadSuggestions()
    } catch (e) { console.error(e) }
  }

  return (
    <div className="glass p-4 rounded-lg">
      <div className="font-semibold mb-2">Bot Suggestions</div>
      {suggestions.length===0 ? <div className="text-sm text-slate-500">No suggestions</div> : (
        <div className="space-y-2">
          {suggestions.map(s => (
            <motion.div key={s.message_id} initial={{opacity:0}} animate={{opacity:1}} className="p-3 bg-white rounded shadow-sm">
              <div className="text-sm">{s.message}</div>
              <div className="flex gap-2 mt-2">
                <button onClick={()=>useSuggestion(s.message_id)} className="px-2 py-1 bg-brand-500 text-white rounded text-xs">Use</button>
                <button className="px-2 py-1 border rounded text-xs">Edit</button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
