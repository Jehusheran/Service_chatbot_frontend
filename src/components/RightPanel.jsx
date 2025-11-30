import React from 'react'
import SummaryPanel from './SummaryPanel'
import BookingPanel from './BookingPanel'
import SuggestionsPanel from './SuggestionsPanel'

export default function RightPanel({ customerId = 'cust_1', agentId = 'agent1' }){
  return (
    <aside className="col-span-3">
      <div className="space-y-4">
        <SummaryPanel customerId={customerId} agentId={agentId}/>
        <SuggestionsPanel customerId={customerId} agentId={agentId}/>
        <BookingPanel customerId={customerId}/>
      </div>
    </aside>
  )
}
