import type { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { getAdminFirestore } from "./firebaseAdmin";
import {
  ContactEnquiry,
  VendorBeneficiary,
  LinkedCard,
  PaymentTransaction,
  KYCRecord,
  UserProfile,
} from "@/types";

// In-memory mock store for local development when Firebase keys are not yet configured
const inMemoryStore = {
  contacts: [
    { id: "cnt_1", name: "Aarav Sharma", email: "aarav@example.com", mobile: "9876543210", subject: "Enterprise Card Settlement", message: "Interested in setting up 50L/month CC settlements for logistics.", createdAt: "Today, 10:15 AM" },
    { id: "cnt_2", name: "Pooja Mehta", email: "pooja@mehtacorp.in", mobile: "9123456780", subject: "Bulk Vendor Upload API", message: "Looking for ERP webhook integration for our vendor payouts.", createdAt: "Yesterday, 03:40 PM" },
  ] as ContactEnquiry[],
  vendors: [
    { id: "v1", userId: "demo-user", name: "Apex Distributors", accountNumber: "50100239482910", ifsc: "HDFC0000102", bankName: "HDFC Bank", isVerified: true, status: "active" as const, createdAt: new Date().toISOString() },
    { id: "v2", userId: "demo-user", name: "Global Logistics Pvt Ltd", accountNumber: "000293849102", ifsc: "ICIC0000004", bankName: "ICICI Bank", isVerified: true, status: "active" as const, createdAt: new Date().toISOString() },
    { id: "v3", userId: "demo-user", name: "Surya Enterprise", accountNumber: "310492837381", ifsc: "SBIN0000781", bankName: "State Bank of India", isVerified: true, status: "active" as const, createdAt: new Date().toISOString() },
    { id: "v4", userId: "demo-user", name: "Metro Tech Solutions", accountNumber: "918029382840", ifsc: "UTIB0000140", bankName: "Axis Bank", isVerified: true, status: "active" as const, createdAt: new Date().toISOString() },
  ] as VendorBeneficiary[],
  cards: [
    { id: "c1", userId: "demo-user", cardHolderName: "Kabir Sharma", cardLabel: "Corporate Card", lastFour: "5820", expiry: "12/29", bankName: "HDFC Bank", network: "visa" as const, isActive: true, createdAt: new Date().toISOString() },
    { id: "c2", userId: "demo-user", cardHolderName: "Kabir Sharma", cardLabel: "Operations Card", lastFour: "9144", expiry: "06/28", bankName: "ICICI Bank", network: "mastercard" as const, isActive: true, createdAt: new Date().toISOString() },
    { id: "c3", userId: "demo-user", cardHolderName: "Kabir Sharma", cardLabel: "Ad-Spend Card", lastFour: "3051", expiry: "08/30", bankName: "Axis Bank", network: "rupay" as const, isActive: false, createdAt: new Date().toISOString() },
  ] as LinkedCard[],
  transactions: [
    { id: "TXN1024", userId: "demo-user", vendorId: "v1", vendorName: "Apex Distributors", cardId: "c1", amount: 45000, feeAmount: 450, totalBilled: 45450, rewardEarned: 900, status: "settled" as const, utrNumber: "UTR9832749102", date: "Today, 10:14 AM", createdAt: new Date().toISOString() },
    { id: "TXN1023", userId: "demo-user", vendorId: "v2", vendorName: "Global Logistics Pvt Ltd", cardId: "c2", amount: 120000, feeAmount: 1200, totalBilled: 121200, rewardEarned: 2400, status: "settled" as const, utrNumber: "UTR8291038472", date: "Yesterday, 04:30 PM", createdAt: new Date().toISOString() },
    { id: "TXN1021", userId: "demo-user", vendorId: "v4", vendorName: "Metro Tech Solutions", cardId: "c2", amount: 85000, feeAmount: 850, totalBilled: 85850, rewardEarned: 1700, status: "settled" as const, utrNumber: "UTR5591029411", date: "16 Oct, 02:15 PM", createdAt: new Date().toISOString() },
    { id: "TXN1019", userId: "demo-user", vendorId: "v3", vendorName: "Surya Enterprise", cardId: "c1", amount: 65000, feeAmount: 650, totalBilled: 65650, rewardEarned: 1300, status: "settled" as const, utrNumber: "UTR3910294819", date: "15 Oct, 05:45 PM", createdAt: new Date().toISOString() },
  ] as PaymentTransaction[],
  kyc: [
    { id: "kyc_1", userId: "demo-user", panNumber: "ABCDE1234F", aadhaarNumberMasked: "•••• •••• 9210", dob: "1988-06-15", address: "Trade Tower, BKC, Mumbai", status: "in_review" as const, submittedAt: "Today, 11:30 AM" },
    { id: "kyc_2", userId: "user_deshmukh", panNumber: "XYZWP9876Q", aadhaarNumberMasked: "•••• •••• 1045", dob: "1992-09-21", address: "MIDC Industrial Estate, Pune", status: "in_review" as const, submittedAt: "Yesterday, 04:15 PM" },
    { id: "kyc_3", userId: "user_malhotra", panNumber: "LMNOP5566R", aadhaarNumberMasked: "•••• •••• 3840", dob: "1985-03-10", address: "Sector 62, Electronic City, Noida", status: "verified" as const, submittedAt: "15 Oct 2026" },
  ] as (KYCRecord & { businessName?: string; name?: string })[],
  users: [] as UserProfile[],
};

// ============================================================================
// Contact Enquiries
// ============================================================================
export async function saveContactEnquiry(data: Omit<ContactEnquiry, "id" | "createdAt">): Promise<ContactEnquiry> {
  const enquiry: ContactEnquiry = {
    id: `cnt_${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
  };

  const firestore = getAdminFirestore();
  if (firestore) {
    await firestore.collection("contact_enquiries").doc(enquiry.id).set(enquiry);
  } else {
    inMemoryStore.contacts.push(enquiry);
  }

  return enquiry;
}

// ============================================================================
// Vendors
// ============================================================================
export async function getVendorsList(userId = "demo-user"): Promise<VendorBeneficiary[]> {
  const firestore = getAdminFirestore();
  if (firestore) {
    const snapshot = await firestore.collection("vendors").where("userId", "==", userId).get();
    if (snapshot.empty && userId === "demo-user") {
      const batch = firestore.batch();
      for (const vendor of inMemoryStore.vendors) {
        batch.set(firestore.collection("vendors").doc(vendor.id), vendor);
      }
      await batch.commit();
      return inMemoryStore.vendors;
    }
    return snapshot.docs.map((doc: QueryDocumentSnapshot) => doc.data() as VendorBeneficiary);
  }
  return inMemoryStore.vendors.filter((v) => v.userId === userId);
}

export async function addVendorBeneficiary(
  vendorData: Omit<VendorBeneficiary, "id" | "createdAt">
): Promise<VendorBeneficiary> {
  const newVendor: VendorBeneficiary = {
    id: `vnd_${Date.now()}`,
    ...vendorData,
    createdAt: new Date().toISOString(),
  };

  const firestore = getAdminFirestore();
  if (firestore) {
    await firestore.collection("vendors").doc(newVendor.id).set(newVendor);
  } else {
    inMemoryStore.vendors.push(newVendor);
  }

  return newVendor;
}

// ============================================================================
// Linked Cards
// ============================================================================
export async function getCardsList(userId = "demo-user"): Promise<LinkedCard[]> {
  const firestore = getAdminFirestore();
  if (firestore) {
    const snapshot = await firestore.collection("cards").where("userId", "==", userId).get();
    if (snapshot.empty && userId === "demo-user") {
      const batch = firestore.batch();
      for (const card of inMemoryStore.cards) {
        batch.set(firestore.collection("cards").doc(card.id), card);
      }
      await batch.commit();
      return inMemoryStore.cards;
    }
    return snapshot.docs.map((doc: QueryDocumentSnapshot) => doc.data() as LinkedCard);
  }
  return inMemoryStore.cards.filter((c) => c.userId === userId);
}

export async function linkNewCard(
  cardData: Omit<LinkedCard, "id" | "createdAt">
): Promise<LinkedCard> {
  const newCard: LinkedCard = {
    id: `crd_${Date.now()}`,
    ...cardData,
    createdAt: new Date().toISOString(),
  };

  const firestore = getAdminFirestore();
  if (firestore) {
    await firestore.collection("cards").doc(newCard.id).set(newCard);
  } else {
    inMemoryStore.cards.push(newCard);
  }

  return newCard;
}

// ============================================================================
// Transactions
// ============================================================================
export async function getTransactionsList(userId = "demo-user"): Promise<PaymentTransaction[]> {
  const firestore = getAdminFirestore();
  if (firestore) {
    const snapshot = await firestore
      .collection("transactions")
      .where("userId", "==", userId)
      .get();
    if (snapshot.empty && userId === "demo-user") {
      const batch = firestore.batch();
      for (const txn of inMemoryStore.transactions) {
        batch.set(firestore.collection("transactions").doc(txn.id), txn);
      }
      await batch.commit();
      return inMemoryStore.transactions;
    }
    const list = snapshot.docs.map((doc: QueryDocumentSnapshot) => doc.data() as PaymentTransaction);
    return list.sort((a: PaymentTransaction, b: PaymentTransaction) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  return inMemoryStore.transactions.filter((t) => t.userId === userId);
}

export async function createPaymentTransaction(
  data: Omit<PaymentTransaction, "id" | "createdAt">
): Promise<PaymentTransaction> {
  const txn: PaymentTransaction = {
    id: `TXN${Math.floor(1000 + Math.random() * 9000)}`,
    ...data,
    createdAt: new Date().toISOString(),
  };

  const firestore = getAdminFirestore();
  if (firestore) {
    await firestore.collection("transactions").doc(txn.id).set(txn);
  } else {
    inMemoryStore.transactions.unshift(txn);
  }

  return txn;
}

// ============================================================================
// KYC Records
// ============================================================================
export async function submitKYCRecord(data: Omit<KYCRecord, "id" | "submittedAt">): Promise<KYCRecord> {
  const record: KYCRecord = {
    id: `kyc_${Date.now()}`,
    ...data,
    submittedAt: new Date().toISOString(),
  };

  const firestore = getAdminFirestore();
  if (firestore) {
    await firestore.collection("kyc_records").doc(record.id).set(record);
  } else {
    inMemoryStore.kyc.push(record);
  }

  return record;
}

export async function getKYCRecords(): Promise<KYCRecord[]> {
  const firestore = getAdminFirestore();
  if (firestore) {
    const snapshot = await firestore.collection("kyc_records").get();
    if (!snapshot.empty) {
      return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      } as KYCRecord));
    }
  }
  return inMemoryStore.kyc;
}

export async function updateKYCStatus(id: string, status: string): Promise<boolean> {
  const firestore = getAdminFirestore();
  if (firestore) {
    await firestore.collection("kyc_records").doc(id).set(
      {
        status,
        reviewedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  }
  const item = inMemoryStore.kyc.find((k) => k.id === id);
  if (item) {
    item.status = (status.toLowerCase() === "approved" ? "verified" : status.toLowerCase()) as KYCRecord["status"];
  }
  return true;
}

export async function getContactEnquiries(): Promise<ContactEnquiry[]> {
  const firestore = getAdminFirestore();
  if (firestore) {
    const snapshot = await firestore.collection("contact_enquiries").get();
    if (!snapshot.empty) {
      return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      } as ContactEnquiry));
    }
  }
  return inMemoryStore.contacts;
}

export async function getAllTransactions(): Promise<PaymentTransaction[]> {
  const firestore = getAdminFirestore();
  if (firestore) {
    const snapshot = await firestore.collection("transactions").get();
    if (!snapshot.empty) {
      return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      } as PaymentTransaction));
    }
  }
  return inMemoryStore.transactions;
}

export async function getTransactionByIdOrUtr(query: string): Promise<PaymentTransaction | null> {
  if (!query) return null;
  const clean = query.trim();

  try {
    const firestore = getAdminFirestore();
    if (firestore) {
      // 1. Direct doc lookup
      const docSnap = await firestore.collection("transactions").doc(clean).get();
      if (docSnap.exists) {
        return { id: docSnap.id, ...docSnap.data() } as PaymentTransaction;
      }

      // 2. Query by UTR
      const utrSnap = await firestore.collection("transactions").where("utrNumber", "==", clean).get();
      if (!utrSnap.empty) {
        const firstDoc = utrSnap.docs[0];
        return { id: firstDoc.id, ...firstDoc.data() } as PaymentTransaction;
      }

      // 3. Query all and find case-insensitive match
      const all = await firestore.collection("transactions").get();
      const found = all.docs
        .map((d: QueryDocumentSnapshot) => ({ id: d.id, ...d.data() } as PaymentTransaction))
        .find(
          (t: PaymentTransaction) =>
            t.id.toLowerCase() === clean.toLowerCase() ||
            (t.utrNumber && t.utrNumber.toLowerCase() === clean.toLowerCase())
        );
      if (found) return found;
    }
  } catch (err) {
    console.warn("Firestore lookup failed, falling back to memory store:", err);
  }

  // Memory store fallback
  const memFound = inMemoryStore.transactions.find(
    (t) =>
      t.id.toLowerCase() === clean.toLowerCase() ||
      (t.utrNumber && t.utrNumber.toLowerCase() === clean.toLowerCase())
  );
  if (memFound) return memFound;

  return null;
}
