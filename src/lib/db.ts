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
  contacts: [] as ContactEnquiry[],
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
  ] as PaymentTransaction[],
  kyc: [] as KYCRecord[],
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
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
