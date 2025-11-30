import React, { useEffect, useRef, useState } from 'react'
import MessageBubble from './MessageBubble'
import Composer from './Composer'
import api from '../api'
import { motion, AnimatePresence } from 'framer-motion'

export default function ConversationPanel({ customerId = 'cust_1', agentId = 'agent1' }){
  const [messages, setMessages] = useState([])
  const scroller = useRef(null)

  useEffect(()=> { loadHistory() }, [customerId, agentId])

  async function loadHistory(){
    try {
      const res = await api.get(`/chat/history/${customerId}/${agentId}`);
      setMessages(res.data.messages || []);
      setTimeout(()=> scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: 'smooth' }), 80)
    } catch (e) { console.error(e) }
  }

  async function sendMessage(text){
    const payload = {
      customer_id: customerId,
      agent_id: agentId,
      messages: [{ sender: 'agent', message: text }]
    };
    await api.post('/chat/save', payload);
    await loadHistory();
  }

  return (
    <div className="col-span-6">
      <div className="bg-white rounded-lg shadow p-4 flex flex-col h-[72vh]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-lg font-semibold">Conversation — {customerId}</div>
            <div className="text-xs text-slate-400">Agent: {agentId}</div>
          </div>
          <div className="text-xs text-slate-400">Status: Online</div>
        </div>

        <div ref={scroller} className="flex-1 overflow-auto p-3 space-y-3 border rounded-md">
          <AnimatePresence initial={false}>
            {messages.map(m => (
              <motion.div key={m.id} initial={{opacity:0, y:6}} animate={{opacity:1, y:0}} exit={{opacity:0}}>
                <MessageBubble message={m} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Composer onSend={sendMessage} />
      </div>
    </div>
  )
}
