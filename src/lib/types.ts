import type { LucideIcon } from 'lucide-react';

export type Account = {
  id: string;
  label: string;
  email: string;
  icon: React.ReactNode;
};

export type Mail = {
  id: string;
  from: {
    name: string;
    email: string;
    avatar: string;
  };
  subject: string;
  body: string;
  date: number; // Use timestamp for sorting
  read: boolean;
  category:
    | 'Interested'
    | 'Meeting Booked'
    | 'Not Interested'
    | 'Spam'
    | 'Out of Office'
    | null;
  labels: string[];
};

export type Folder = {
  name: string;
  icon: LucideIcon;
  count?: number;
};
