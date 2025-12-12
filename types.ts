export interface AssignmentData {
  id?: string;
  userId: string;
  topic: string;
  format: string;
  length?: string; // Short, Medium, Long
  createdAt: any; // Firestore timestamp
  sections: {
    introduction: string;
    development: string;
    conclusion: string;
    bibliography: string;
  };
}

export enum AcademicFormat {
  ABNT = 'ABNT',
  APA = 'APA',
  Normal = 'Normal'
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
}