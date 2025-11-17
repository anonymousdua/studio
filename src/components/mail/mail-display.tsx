'use client';

import * as React from 'react';
import { format } from 'date-fns';
import {
  Archive,
  ArchiveX,
  Clock,
  Forward,
  MoreVertical,
  Reply,
  ReplyAll,
  Sparkles,
} from 'lucide-react';
import { generateSuggestedReplies } from '@/ai/flows/generate-suggested-replies';
import type { Mail } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/componentsg/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '@/hooks/use-toast';

interface MailDisplayProps {
  mail: Mail | null;
}

export function MailDisplay({ mail }: MailDisplayProps) {
  const [suggestedReply, setSuggestedReply] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    setSuggestedReply('');
  }, [mail]);

  const handleGenerateReply = async () => {
    if (!mail) return;
    setIsLoading(true);
    setSuggestedReply('');
    try {
      // In a real app, this would be dynamic, e.g., from user settings
      const productAgenda =
        "I am applying for a job position. If the lead is interested, share the meeting booking link: https://cal.com/example";
      const result = await generateSuggestedReplies({
        emailContent: mail.body,
        productAgenda,
      });
      setSuggestedReply(result.suggestedReply);
    } catch (error) {
      console.error('Failed to generate reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate AI reply. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryBadgeVariant = (
    category: Mail['category']
  ): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (!category) return 'secondary';
    switch (category) {
      case 'Interested':
        return 'default';
      case 'Meeting Booked':
        return 'default';
      case 'Not Interested':
        return 'secondary';
      case 'Spam':
      case 'Out of Office':
        return 'destructive';
      default:
        return 'outline';
    }
  };

toclassName = (
    category: Mail['category']
  ): string => {
    if (category === 'Interested') return 'bg-green-500/20 text-green-700 border-green-500/30';
    return '';
  }


  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Archive className="h-4 w-4" />
                <span className="sr-only">Archive</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Archive</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <ArchiveX className="h-4 w-4" />
                <span className="sr-only">Move to junk</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Move to junk</TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <div className="ml-auto flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Reply className="h-4 w-4" />
                <span className="sr-only">Reply</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <ReplyAll className="h-4 w-4" />
                <span className="sr-only">Reply all</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reply all</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Forward className="h-4 w-4" />
                <span className="sr-only">Forward</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Forward</TooltipContent>
          </Tooltip>
        </div>
        <Separator orientation="vertical" className="mx-2 h-6" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={!mail}>
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">More</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Mark as unread</DropdownMenuItem>
            <DropdownMenuItem>Star thread</DropdownMenuItem>
            <DropdownMenuItem>Add label</DropdownMenuItem>
            <DropdownMenuItem>Mute thread</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Separator />
      {mail ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <Avatar>
                <AvatarImage alt={mail.from.name} src={mail.from.avatar} />
                <AvatarFallback>
                  {mail.from.name
                    .split(' ')
                    .map((chunk) => chunk[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <div className="font-semibold">{mail.from.name}</div>
                <div className="line-clamp-1 text-xs">{mail.from.email}</div>
                <div className="line-clamp-1 text-xs">
                  <span className="font-medium">Reply-to:</span>{' '}
                  {mail.from.email}
                </div>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2 text-xs">
              <div className="text-muted-foreground">
                {format(new Date(mail.date), 'PPpp')}
              </div>
              {mail.category && (
                <Badge
                  variant={getCategoryBadgeVariant(mail.category)}
                  className={getCategoryBadgeClassName(mail.category)}
                >
                  {mail.category}
                </Badge>
              )}
            </div>
          </div>
          <Separator />
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
            <div dangerouslySetInnerHTML={{ __html: mail.body }} />
          </div>
          <Separator className="mt-auto" />
          <div className="p-4">
            <Card>
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-lg">AI Suggested Reply</CardTitle>
                <Button
                  onClick={handleGenerateReply}
                  disabled={isLoading}
                  size="sm"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isLoading ? 'Generating...' : 'Generate Reply'}
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading && (
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                )}
                {suggestedReply && (
                  <Textarea
                    rows={5}
                    defaultValue={suggestedReply}
                    className="mt-2"
                  />
                )}
                {!isLoading && !suggestedReply && (
                  <p className="text-center text-sm text-muted-foreground">
                    Click 'Generate Reply' to get an AI-powered suggestion.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <div className="p-4 text-center text-muted-foreground">
          No message selected
        </div>
      )}
    </div>
  );
}
