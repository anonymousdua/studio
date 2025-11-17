# **App Name**: MailWise AI

## Core Features:

- Real-Time IMAP Sync: Synchronize multiple IMAP email accounts (minimum 2) in real-time using persistent connections, fetching at least the last 30 days of emails.
- Elasticsearch Storage: Store and index emails in a locally hosted Elasticsearch instance for fast, searchable storage.  Support filtering by folder & account.
- AI Email Categorization: Categorize emails using an AI model into labels: Interested, Meeting Booked, Not Interested, Spam, and Out of Office.
- Slack & Webhook Notifications: Send Slack notifications for every new 'Interested' email and trigger webhooks (webhook.site) for external automation when an email is marked as 'Interested'.
- Frontend Interface: Build a UI to display emails, filter by folder/account, and show AI categorization. Implements email search functionality powered by Elasticsearch.
- AI Suggested Replies: Use RAG (Retrieval-Augmented Generation) to suggest replies. The LLM will reason when it can act as a tool and utilize user specific information like links, when generating output.
- Vector Database Storage: Store product and outreach agenda data in a vector database.

## Style Guidelines:

- Primary color: A calming blue (#5DADE2) to evoke trust and intelligence, suitable for an email application.
- Background color: Light, desaturated blue (#E8F4FC), providing a clean and unobtrusive backdrop.
- Accent color: A gentle green (#82E0AA), analogous to blue, used to indicate positive actions or categories such as 'Interested'.
- Body and headline font: 'Inter', a grotesque-style sans-serif for a modern and neutral look.
- Use simple, clear icons to represent email actions and categories.
- Maintain a clean, intuitive layout with clear separation of email lists, previews, and action buttons.
- Use subtle transitions and loading animations to enhance user experience.