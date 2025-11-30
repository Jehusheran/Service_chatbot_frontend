import React from 'react'
import Shell from '../components/Shell'
import ConversationPanel from '../components/ConversationPanel'
import RightPanel from '../components/RightPanel'

export default function Dashboard(){
  const customerId = 'cust_1'
  const agentId = 'agent1'
  return (
    <Shell>
      <div className="grid grid-cols-12 gap-6">
        <ConversationPanel customerId={customerId} agentId={agentId} />
        <RightPanel customerId={customerId} agentId={agentId} />
      </div>
    </Shell>
  )
}
