'use client';

import * as React from 'react';
import {
  ChevronsLeft,
  ChevronsRight,
  Inbox,
  Send,
  Archive,
  Trash2,
  File,
  Users,
  Settings,
  Star,
  Search,
} from 'lucide-react';

import { accounts, folders } from '@/lib/data';
import type { Mail } from '@/lib/types';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Nav } from '@/components/mail/nav';
import { MailList } from '@/components/mail/mail-list';
import { MailDisplay } from '@/components/mail/mail-display';
import { MailWiseAiLogo } from '@/components/mail-wise-ai-logo';
import { UserNav } from '@/components/user-nav';
import { Skeleton } from '@/components/ui/skeleton';

export default function MailPage() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [mails, setMails] = React.useState<Mail[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedMailId, setSelectedMailId] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    async function fetchMails() {
      setIsLoading(true);
      try {
        const response = await fetch('/api/emails');
        if (!response.ok) {
          throw new Error('Failed to fetch emails');
        }
        const data: Mail[] = await response.json();
        setMails(data);
        if (data.length > 0) {
          setSelectedMailId(data[0].id);
        }
      } catch (error) {
        console.error(error);
        // You might want to show a toast notification to the user here
      } finally {
        setIsLoading(false);
      }
    }
    fetchMails();
  }, []);

  const selectedMail = mails.find((m) => m.id === selectedMailId) ?? null;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-screen flex-col items-stretch">
        <header className="flex h-16 items-center justify-between border-b bg-card px-4">
          <div className="flex items-center gap-4">
            <div className={cn('hidden', !isCollapsed && 'md:block')}>
              <MailWiseAiLogo />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronsRight /> : <ChevronsLeft />}
              <span className="sr-only">Toggle Sidebar</span>
            </Button>
          </div>
          <div className="flex-1 px-8">
            <div className="relative mx-auto w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search mail..." className="pl-9" />
            </div>
          </div>
          <UserNav />
        </header>

        <div className="flex flex-1 items-stretch overflow-hidden">
          <div
            className={cn(
              'flex-col items-stretch border-r bg-background transition-all duration-300 ease-in-out',
              isCollapsed ? 'w-20' : 'w-80'
            )}
          >
            <Nav
              isCollapsed={isCollapsed}
              accounts={accounts}
              folders={folders}
            />
          </div>

          <div className="w-full max-w-sm border-r xl:max-w-md">
            {isLoading ? (
              <div className="p-4 space-y-2">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <MailList
                mails={mails}
                onSelectMail={(mail) => setSelectedMailId(mail.id)}
                selectedMailId={selectedMailId}
              />
            )}
          </div>

          <div className="flex-1">
            <MailDisplay mail={selectedMail} />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
