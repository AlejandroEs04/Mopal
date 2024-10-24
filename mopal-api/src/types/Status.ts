const purchaseStatus = {
    GENERATED: 'generated', 
    RECEIVED: 'received'
} as const 

export type PurchaseStatus = typeof purchaseStatus[keyof typeof purchaseStatus]

const pendingRequestStatus = {
    PENDING: 'pending', 
    APPROVED: 'approved', 
    REJECTED: 'rejected'
} as const 

export type PendingRequetsStatus = typeof pendingRequestStatus[keyof typeof pendingRequestStatus]
