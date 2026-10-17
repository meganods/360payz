/**
 * 360payZ Core Data Models & Backend Contract Types
 * 
 * These types match the Firestore document structure and backend API contracts.
 */

// -------------------------------------------------------------
// 1. User & Business Profile (Collection: 'users')
// -------------------------------------------------------------
export interface UserProfile {
  uid: string; // Firebase Auth UID
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  businessType?: "proprietorship" | "partnership" | "llp" | "pvt_ltd" | "individual";
  gstin?: string;
  panNumber?: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  kycStatus: KYCStatus;
  availableCreditLimit: number;
  totalSettlements: number;
  rewardBalance: number;
  createdAt: string; // ISO String or Firestore Timestamp
  updatedAt: string;
}

// -------------------------------------------------------------
// 2. KYC Verification Record (Collection: 'kyc_records')
// -------------------------------------------------------------
export type KYCStatus = "pending" | "in_review" | "verified" | "rejected";

export interface KYCRecord {
  id: string;
  userId: string;
  panNumber: string;
  panDocumentUrl?: string;
  aadhaarNumberMasked: string; // Stored masked (e.g. •••• •••• 9210)
  aadhaarFrontUrl?: string;
  aadhaarBackUrl?: string;
  dob: string;
  address: string;
  status: KYCStatus;
  rejectionReason?: string;
  submittedAt: string;
  verifiedAt?: string;
}

// -------------------------------------------------------------
// 3. Vendor / Beneficiary (Collection: 'vendors')
// -------------------------------------------------------------
export interface VendorBeneficiary {
  id: string;
  userId: string;
  name: string;
  accountNumber: string;
  ifsc: string;
  bankName: string;
  category?: string; // e.g. "Rent", "Inventory", "Logistics", "Utilities"
  isVerified: boolean; // Verified via Penny-drop or IFSC lookup
  status: "active" | "inactive";
  createdAt: string;
}

// -------------------------------------------------------------
// 4. Linked Credit Cards (Collection: 'cards')
// -------------------------------------------------------------
export interface LinkedCard {
  id: string;
  userId: string;
  cardHolderName: string;
  cardLabel: string; // e.g. "Corporate Operations", "Ad-Spend"
  lastFour: string;
  expiry: string; // MM/YY
  bankName: string;
  network?: "visa" | "mastercard" | "rupay" | "amex";
  cardToken?: string; // Tokenized reference from PCI-DSS partner
  isActive: boolean;
  createdAt: string;
}

// -------------------------------------------------------------
// 5. Payment Transaction & Settlement (Collection: 'transactions')
// -------------------------------------------------------------
export type TransactionStatus = "initiated" | "pending" | "processing" | "settled" | "failed";

export interface PaymentTransaction {
  id: string; // TXN ref, e.g. TXN1024
  userId: string;
  vendorId: string;
  vendorName: string;
  cardId: string;
  amount: number;
  feeAmount: number; // Transparent processing charge
  totalBilled: number;
  rewardEarned: number;
  status: TransactionStatus;
  utrNumber?: string; // Bank UTR after settlement
  settlementTimeEst?: string; // e.g. "2-5 minutes"
  date: string;
  createdAt: string;
}

// -------------------------------------------------------------
// 6. Support Tickets (Collection: 'support_tickets')
// -------------------------------------------------------------
export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userPhone?: string;
  query: string;
  status: "Open" | "In_Progress" | "Resolved";
  createdAt: string;
}

// -------------------------------------------------------------
// 7. Contact Enquiries (Collection: 'contact_enquiries')
// -------------------------------------------------------------
export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
  createdAt: string;
}
