// IMPORTANT: This is a demonstration and not for production use.
// Storing credentials in .env files is not recommended for production.
// A secure backend with OAuth2 is the proper way to handle this.

import { NextRequest, NextResponse } from 'next/server';
import Imap from 'node-imap';
import { simpleParser } from 'mailparser';
import { config } from 'dotenv';

// Load environment variables from .env file
config();

// Define the structure of an email, matching the frontend type
type Mail = {
  id: string;
  from: {
    name: string;
    email: string;
    avatar: string; // We'll use a placeholder for the avatar
  };
  subject: string;
  body: string;
  date: number;
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

function getImapConfig(): Imap.Config {
  const user = process.env.GMAIL_USER;
  const password = process.env.GMAIL_APP_PASSWORD;

  if (!user || !password) {
    throw new Error('Gmail credentials are not set in the .env file');
  }

  return {
    user,
    password,
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false,
    },
  };
}

export async function GET(req: NextRequest) {
  try {
    const imapConfig = getImapConfig();
    const emails = await fetchEmails(imapConfig);
    return NextResponse.json(emails);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch emails' }, { status: 500 });
  }
}

function fetchEmails(config: Imap.Config): Promise<Mail[]> {
  return new Promise((resolve, reject) => {
    const imap = new Imap(config);

    imap.once('ready', () => {
      imap.openBox('INBOX', true, (err, box) => {
        if (err) {
          reject(err);
          return;
        }

        // Fetch the last 20 emails
        const fetch = imap.seq.fetch(`${Math.max(1, box.messages.total - 19)}:*`, {
          bodies: '',
          struct: true,
        });

        const emails: Mail[] = [];

        fetch.on('message', (msg, seqno) => {
          let buffer = '';
          msg.on('body', (stream, info) => {
            stream.on('data', (chunk) => {
              buffer += chunk.toString('utf8');
            });
          });

          msg.once('end', () => {
            simpleParser(buffer)
              .then((parsed) => {
                const from = parsed.from?.value[0];
                const mail: Mail = {
                  id: parsed.messageId || `msg-${seqno}`,
                  from: {
                    name: from?.name || from?.address || 'Unknown Sender',
                    email: from?.address || 'unknown@example.com',
                    avatar: `https://picsum.photos/seed/${from?.address || seqno}/40/40`,
                  },
                  subject: parsed.subject || 'No Subject',
                  body: parsed.html || parsed.textAsHtml || '<p>No content</p>',
                  date: parsed.date ? new Date(parsed.date).getTime() : Date.now(),
                  read: false, // IMAP flags would be needed for this
                  category: null, // AI categorization would happen later
                  labels: [], // Would require parsing headers or using other logic
                };
                emails.push(mail);
              })
              .catch(reject);
          });
        });

        fetch.once('error', (err) => {
          reject(err);
        });

        fetch.once('end', () => {
          imap.end();
          // Sort emails by date, newest first
          resolve(emails.sort((a, b) => b.date - a.date));
        });
      });
    });

    imap.once('error', (err) => {
      reject(err);
    });

    imap.once('end', () => {
      // Connection ended
    });

    imap.connect();
  });
}
