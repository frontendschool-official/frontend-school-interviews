import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from './config';
import {
  DocumentUtils,
  FirebaseErrorHandler,
  ValidationUtils,
  SortUtils,
} from './utils';
import {
  ProblemData,
  ParsedProblemData,
  SubmissionData,
  parseProblemData,
  MockInterviewProblem,
  MockInterviewSubmission,
  MockInterviewResult,
} from '../../types/problem';

// ============================
// PROBLEM MANAGEMENT
// ============================

export const saveProblemSet = async (userId: string, data: ProblemData) => {
  console.log('💾 Starting saveProblemSet with:', {
    userId,
    dataKeys: Object.keys(data),
    interviewType: data.interviewType,
    hasUserId: !!data.userId,
    dataSize: JSON.stringify(data).length,
  });

  ValidationUtils.requireField(userId, 'User ID');
  ValidationUtils.validateProblemData(data);

  console.log('✅ Data validation passed');

  try {
    const ref = collection(db, 'interview_problems');

    const docData = {
      ...data,
      userId,
      createdAt: DocumentUtils.createTimestamp(),
    };

    console.log('📝 Attempting to add document to Firestore...');
    const docRef = await addDoc(ref, docData);
    console.log('✅ Document saved successfully with ID:', docRef.id);

    return docRef;
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'save problem set');
  }
};

export const saveInterviewProblemDocument = async (docInput: {
  title: string;
  type: 'machine_coding' | 'dsa' | 'system_design' | 'js_concepts';
  difficulty: 'easy' | 'medium' | 'hard';
  company: string;
  role: string;
  problem: {
    description: string;
    input_format: string;
    output_format: string;
    constraints: string;
    sample_input: string;
    sample_output: string;
    follow_up_questions?: string[];
  };
  interviewType?: string;
  designation?: string;
  companies?: string;
  round?: string;
  source?: string;
  userId?: string;
  interviewId?: string;
  roundNumber?: number;
}) => {
  try {
    const ref = collection(db, 'interview_problems');
    const payload: any = {
      ...docInput,
      createdAt: DocumentUtils.createServerTimestamp(),
      updatedAt: DocumentUtils.createServerTimestamp(),
    };
    const docRef = await addDoc(ref, payload as any);
    return docRef;
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'save interview problem document');
  }
};

export const getProblemSetsForUser = async (userId: string) => {
  const problems = await DocumentUtils.queryDocuments('interview_problems', [
    ['userId', '==', userId],
  ]);
  return SortUtils.sortByDate(problems, 'createdAt');
};

export const saveSubmission = async (
  userId: string,
  problemId: string,
  data: SubmissionData
) => {
  ValidationUtils.requireFields(
    {
      userId,
      problemId,
      designation: data.designation,
      feedback: data.feedback,
    },
    ['userId', 'problemId', 'designation', 'feedback']
  );

  try {
    const ref = collection(db, 'submissions');
    return await addDoc(ref, {
      userId,
      problemId,
      ...data,
      createdAt: DocumentUtils.createTimestamp(),
    });
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'save submission');
  }
};

export const getSubmissionsForUser = async (userId: string) => {
  try {
    console.log('Getting submissions for user:', userId);
    const submissions = await DocumentUtils.queryDocuments('submissions', [
      ['userId', '==', userId],
    ]);
    const sortedSubmissions = SortUtils.sortByDate(submissions, 'createdAt');

    console.log('Submissions for user:', sortedSubmissions);
    return sortedSubmissions;
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'fetch submissions for user');
  }
};

export const getProblemById = async (
  id: string
): Promise<ParsedProblemData | null> => {
  console.log('id', id);
  ValidationUtils.requireField(id, 'Problem ID');

  try {
    const ref = collection(db, 'interview_problems');
    const { doc, getDoc } = await import('firebase/firestore');
    const docRef = doc(ref, id);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const data = { id: snapshot.id, ...snapshot.data() } as any;
      console.log('=== getProblemById Debug ===');
      console.log('Problem ID:', id);
      console.log('Raw data from Firebase:', data);
      console.log('Interview Type:', data.interviewType);
      console.log('Theory Problem exists:', !!data.theoryProblem);
      // const parsedData = parseProblemData(data);
      // console.log('Parsed data:', parsedData);
      console.log('=== End getProblemById Debug ===');
      return {
        ...data,
        problem:
          typeof data?.problem === 'string'
            ? JSON.parse(data.problem)
            : data.problem,
      };
    } else {
      if (id.startsWith('sample-theory-')) {
        console.warn(
          'Sample theory problems are no longer supported. Please use real problems from Firebase.'
        );
        return null;
      }
      return null;
    }
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'fetch problem by ID');
  }
};

export const getAllProblems = async () => {
  try {
    const ref = collection(db, 'interview_problems');
    const q = query(ref, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const problems: ParsedProblemData[] = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      const parsedData = parseProblemData({ ...data, id: doc.id });
      problems.push(parsedData);
    });

    return problems;
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'get all problems');
  }
};

// ============================
// MOCK INTERVIEW FUNCTIONS
// ============================

export const createMockInterviewSession = async (sessionData: {
  userId: string;
  simulationId?: string;
  companyName: string;
  roleLevel: string;
  roundName: string;
  roundType:
    | 'dsa'
    | 'machine_coding'
    | 'system_design'
    | 'theory_and_debugging';
  problems: MockInterviewProblem[];
  currentProblemIndex: number;
  status: 'active' | 'completed' | 'evaluated';
  startedAt: any;
  completedAt?: any;
  totalScore?: number;
  feedback?: string;
}) => {
  try {
    console.log('Creating mock interview session with data:', sessionData);

    ValidationUtils.requireFields(sessionData, [
      'userId',
      'companyName',
      'roleLevel',
      'roundName',
      'roundType',
    ]);

    const ref = collection(db, 'mock_interview_sessions');
    const docData = {
      ...sessionData,
      createdAt: DocumentUtils.createTimestamp(),
    };

    console.log('Saving to Firebase with docData:', docData);
    const docRef = await addDoc(ref, docData);
    const result = { ...docData, id: docRef.id };

    console.log('Mock interview session created successfully:', result);
    return result;
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'create mock interview session');
  }
};

export const updateMockInterviewSession = async (
  sessionId: string,
  updates: any
) => {
  try {
    const ref = doc(db, 'mock_interview_sessions', sessionId);
    await updateDoc(ref, updates);
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'update mock interview session');
  }
};

export const getMockInterviewSession = async (
  sessionId: string
): Promise<any | null> => {
  return await DocumentUtils.getDocument('mock_interview_sessions', sessionId);
};

export const saveMockInterviewProblem = async (
  problem: MockInterviewProblem
) => {
  try {
    const ref = collection(db, 'mock_interview_problems');
    const docData = {
      ...problem,
      createdAt: DocumentUtils.createTimestamp(),
    };
    const docRef = await addDoc(ref, docData);
    return { ...docData, id: docRef.id };
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'save mock interview problem');
  }
};

export const checkProblemExists = async (
  title: string,
  type: string
): Promise<boolean> => {
  try {
    const ref = collection(db, 'mock_interview_problems');
    const q = query(
      ref,
      where('title', '==', title),
      where('type', '==', type)
    );
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if problem exists:', error);
    return false;
  }
};

export const saveMockInterviewSubmission = async (
  submission: MockInterviewSubmission
) => {
  try {
    const ref = collection(db, 'mock_interview_submissions');
    const docData = {
      ...submission,
      submittedAt: DocumentUtils.createTimestamp(),
    };
    const docRef = await addDoc(ref, docData);
    return { ...docData, id: docRef.id };
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'save mock interview submission');
  }
};

export const saveMockInterviewResult = async (result: MockInterviewResult) => {
  try {
    const ref = collection(db, 'mock_interview_results');
    const docData = {
      ...result,
      completedAt: DocumentUtils.createTimestamp(),
    };
    const docRef = await addDoc(ref, docData);
    return { ...docData, id: docRef.id };
  } catch (error) {
    FirebaseErrorHandler.handle(error, 'save mock interview result');
  }
};

export const getProblemsByCompanyRoleRound = async (
  company: string,
  role: string,
  round: string,
  interviewType: string
): Promise<MockInterviewProblem[]> => {
  try {
    const ref = collection(db, 'interview_problems');
    const q = query(
      ref,
      where('company', '==', company),
      where('role', '==', role),
      where('round', '==', round),
      where('interviewType', '==', interviewType)
    );
    const querySnapshot = await getDocs(q);

    const problems: MockInterviewProblem[] = [];
    querySnapshot.forEach(doc => {
      const data = doc.data();
      problems.push(data as MockInterviewProblem);
    });

    return problems;
  } catch (error) {
    console.error('Error getting problems by company/role/round:', error);
    return [];
  }
};

export const saveProblemsToStructuredCollection = async (
  company: string,
  role: string,
  round: string,
  interviewType: string,
  problems: MockInterviewProblem[]
) => {
  try {
    const ref = doc(
      db,
      'companies',
      company,
      'roles',
      role,
      'rounds',
      round,
      'interviewType',
      interviewType
    );
    await updateDoc(ref, {
      problems,
      updatedAt: DocumentUtils.createTimestamp(),
    });
  } catch (error) {
    FirebaseErrorHandler.handle(
      error,
      'save problems to structured collection'
    );
  }
};
