import {
  Users,
  Archive,
  Send,
  Trash2,
  Inbox,
  File,
  Star,
} from 'lucide-react';
import type { Account, Mail, Folder } from './types';

export const accounts: Account[] = [
  {
    id: 'account-1',
    label: 'Alicia Koch',
    email: 'alicia@example.com',
    icon: (
      <img
        className="h-6 w-6 rounded-full"
        src="https://picsum.photos/seed/alicia/40/40"
        alt="Alicia Koch"
        data-ai-hint="woman portrait"
      />
    ),
  },
  {
    id: 'account-2',
    label: 'Kaiden Herman',
    email: 'kaiden@example.com',
    icon: (
      <img
        className="h-6 w-6 rounded-full"
        src="https://picsum.photos/seed/kaiden/40/40"
        alt="Kaiden Herman"
        data-ai-hint="man portrait"
      />
    ),
  },
];

export const folders: Folder[] = [
  { name: 'Inbox', icon: Inbox, count: 128 },
  { name: 'Sent', icon: Send },
  { name: 'Starred', icon: Star },
  { name: 'Drafts', icon: File, count: 9 },
  { name: 'Spam', icon: Archive },
  { name: 'Trash', icon: Trash2 },
];

export const mails: Mail[] = [
  {
    id: 'm1',
    from: {
      name: 'Olivia Martin',
      email: 'olivia.martin@example.com',
      avatar: 'https://picsum.photos/seed/olivia/40/40',
    },
    subject: 'Re: Technical Interview Shortlist',
    body: `
<p>Hi Team,</p>
<p>Thank you for shortlisting my profile! I'm very interested in the position and available for a technical interview next week.</p>
<p>Could you please let me know what times work best for you?</p>
<p>Best regards,<br>Olivia Martin</p>
    `,
    date: Date.now() - 1000 * 60 * 5,
    read: false,
    category: 'Interested',
    labels: ['job-application', 'interview'],
  },
  {
    id: 'm2',
    from: {
      name: 'Meeting Scheduler',
      email: 'scheduler@example.com',
      avatar: 'https://picsum.photos/seed/scheduler/40/40',
    },
    subject: 'Invitation: Sync-up @ Wed, May 29, 2024 2:30pm - 3:30pm (your-email@example.com)',
    body: `
<p>You have been invited to the following event.</p>
<p><strong>Title:</strong> Sync-up</p>
<p><strong>Date:</strong> Wed, May 29, 2024</p>
<p><strong>Time:</strong> 2:30pm - 3:30pm</p>
<p>Please accept or decline this invitation.</p>
    `,
    date: Date.now() - 1000 * 60 * 30,
    read: false,
    category: 'Meeting Booked',
    labels: [],
  },
  {
    id: 'm3',
    from: {
      name: 'James Smith',
      email: 'james.smith@corporate.com',
      avatar: 'https://picsum.photos/seed/james/40/40',
    },
    subject: 'Re: Your Proposal',
    body: `
<p>Hi,</p>
<p>Thanks for reaching out. After reviewing your proposal, we've decided not to move forward at this time. We appreciate your interest and will keep your information on file for future opportunities.</p>
<p>Regards,<br>James Smith</p>
    `,
    date: Date.now() - 1000 * 60 * 60 * 2,
    read: true,
    category: 'Not Interested',
    labels: ['follow-up'],
  },
  {
    id: 'm4',
    from: {
      name: 'Win a FREE iPhone!',
      email: 'contest-winner@spammer.net',
      avatar: 'https://picsum.photos/seed/spammer/40/40',
    },
    subject: 'Congratulations! You have been selected!',
    body: `
<p>YOU'VE WON! CLICK HERE TO CLAIM YOUR FREE IPHONE 15 PRO!</p>
<p>This is a limited-time offer. Do not miss out on this incredible opportunity. Our stock is running low.</p>
<p><a href="#">CLAIM NOW</a></p>
    `,
    date: Date.now() - 1000 * 60 * 60 * 5,
    read: true,
    category: 'Spam',
    labels: [],
  },
  {
    id: 'm5',
    from: {
      name: 'Isabella Nguyen',
      email: 'isabella.nguyen@work.com',
      avatar: 'https://picsum.photos/seed/isabella/40/40',
    },
    subject: 'Out of Office: Annual Leave',
    body: `
<p>Thank you for your email.</p>
<p>I am currently out of the office on annual leave and will return on June 3rd. I will have limited access to email and will respond to your message upon my return.</p>
<p>For urgent matters, please contact my colleague at colleague@work.com.</p>
<p>Best,</p>
<p>Isabella</p>
    `,
    date: Date.now() - 1000 * 60 * 60 * 24,
    read: true,
    category: 'Out of Office',
    labels: [],
  },
  {
    id: 'm6',
    from: {
      name: 'Product Updates',
      email: 'noreply@product.com',
      avatar: 'https://picsum.photos/seed/product/40/40',
    },
    subject: 'New features are now live!',
    body: `
<p>Hello,</p>
<p>We're excited to announce some amazing new features that are now available in your account. Log in to check them out!</p>
<p>The Product Team</p>
    `,
    date: Date.now() - 1000 * 60 * 60 * 25,
    read: true,
    category: null,
    labels: ['product', 'update'],
  },
  {
    id: 'm7',
    from: {
      name: 'Ethan Williams',
      email: 'ethan.williams@startup.io',
      avatar: 'https://picsum.photos/seed/ethan/40/40',
    },
    subject: 'Quick question about your services',
    body: `
<p>Hi there,</p>
<p>I came across your portfolio and I'm really impressed with your work. We are looking for someone with your skills for a freelance project.</p>
<p>Would you be open to a quick chat next week to discuss?</p>
<p>Best,<br>Ethan</p>
    `,
    date: Date.now() - 1000 * 60 * 60 * 48,
    read: true,
    category: 'Interested',
    labels: ['freelance', 'prospect'],
  },
];
