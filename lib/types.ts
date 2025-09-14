
export type Complaint = {
  id: string;
  category: string;
  date: string;
  status: 'Submitted' | 'In Progress' | 'Resolved' | 'Rejected';
  department: string;
  isPriority?: boolean;
};

export type SubmittedComplaint = {
  id: string;
  category: string;
  status: 'Submitted' | 'In Progress' | 'Resolved' | 'Rejected';
  isPriority?: boolean;
};
