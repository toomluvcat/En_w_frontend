export interface LoanItem {
  ItemID: number
  Name: string
  Quantity: number
  ImageUrl?: string
}

export interface LoanEvent {
  EventID: number
  UserName: string
  UserID: number
  CreatedAt: string
  ApprovedAt: string | null
  Status: string
  Loan: LoanItem[]
}
