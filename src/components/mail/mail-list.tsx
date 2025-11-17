'use client';

import { formatDistanceToNow } from 'date-fns';
import type { Mail } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MailListProps {
  mails: Mail[];
  onSelectMail: (mail: Mail) => void;
  selectedMailId: string | null;
}

export function MailList({
  mails,
  onSelectMail,
  selectedMailId,
}: MailListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-2 p-4 pt-2">
        {mails.map((mail) => (
          <button
            key={mail.id}
            className={cn(
              'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm shadow-sm transition-all hover:bg-accent/50',
              selectedMailId === mail.id && 'bg-accent'
            )}
            onClick={() => onSelectMail(mail)}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{mail.from.name}</div>
                  {!mail.read && (
                    <span className="flex h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <div
                  className={cn(
                    'ml-auto text-xs',
                    selectedMailId === mail.id
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  )}
                >
                  {formatDistanceToNow(new Date(mail.date), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div className="text-xs font-medium">{mail.subject}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {mail.body.replace(/<[^>]+>/g, '').substring(0, 300)}
            </div>
            {mail.labels.length > 0 && (
              <div className="flex items-center gap-2">
                {mail.labels.map((label) => (
                  <Badge key={label} variant="secondary">
                    {label}
                  </Badge>
                ))}
              </div>
            )}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
