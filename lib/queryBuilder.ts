import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/services/firebase/config";
import { COLLECTIONS } from "@/enums/collections";

export const getUserProfileByUserId = async (userId: string) => {
  const docRef = doc(db, COLLECTIONS.USERS, userId);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

export const getAllCompanies = async () => {
  const snapshot = await getDocs(query(collection(db, COLLECTIONS.COMPANIES)));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as any[];
};

export const getCompanyById = async (companyId: string) => {
  const docRef = doc(db, COLLECTIONS.COMPANIES, companyId);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

export const searchCompaniesByIncludeQuery = async (
  searchQuery: string,
  field: string = "name"
) => {
  const snapshot = await getDocs(collection(db, COLLECTIONS.COMPANIES));
  const searchLower = searchQuery.toLowerCase();

  return snapshot.docs
    .map((doc) => doc.data())
    .filter(
      (company: any) =>
        company[field]?.toLowerCase().includes(searchLower) ||
        company[`${field}Lower`]?.includes(searchLower)
    );
};

export const addDesignationToCompany = async (
  companyId: string,
  designations: string[]
) => {
  const docRef = doc(db, COLLECTIONS.COMPANIES, companyId);
  await updateDoc(docRef, {
    designations: arrayUnion(...designations),
  });
};

export const getDesignationsByCompanyId = async (companyId: string) => {
  const docRef = doc(db, COLLECTIONS.COMPANIES, companyId);
  const docSnap = await getDoc(docRef);
  const companyData = docSnap.data();
  return companyData?.designations || [];
};

export const getAllProblems = async () => {
  const snapshot = await getDocs(
    query(collection(db, COLLECTIONS.INTERVIEW_PROBLEMS))
  );
  return snapshot.docs.map((doc) => doc.data());
};

export const getProblemById = async (id: string) => {
  const docRef = doc(db, COLLECTIONS.INTERVIEW_PROBLEMS, id);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

export const getActiveInterviewSimulationByUserId = async (
  userId: string,
  status: string = "active"
) => {
  const q = query(
    collection(db, COLLECTIONS.INTERVIEW_SIMULATIONS),
    where("userId", "==", userId),
    where("status", "==", status)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
