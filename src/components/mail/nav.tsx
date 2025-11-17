'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Account, Folder } from '@/lib/types';
import { Separator } from '../ui/separator';

interface NavProps {
  isCollapsed: boolean;
  accounts: Account[];
  folders: Folder[];
}

export function Nav({ isCollapsed, accounts, folders }: NavProps) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {accounts.map((account, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 text-primary',
                    'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
                  )}
                >
                  {account.icon}
                  <span className="sr-only">{account.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {account.label}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href="#"
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-primary transition-colors hover:bg-primary/10',
                'dark:text-muted-foreground'
              )}
            >
              {account.icon}
              <div className="flex flex-col">
                <span className="font-semibold">{account.label}</span>
                <span className="text-xs text-muted-foreground">
                  {account.email}
                </span>
              </div>
            </Link>
          )
        )}
      </nav>
      <Separator />
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {folders.map((folder, index) =>
          isCollapsed ? (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                    index === 0 && 'bg-muted text-foreground'
                  )}
                >
                  <folder.icon className="h-5 w-5" />
                  <span className="sr-only">{folder.name}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {folder.name}
                {folder.count && (
                  <span className="ml-auto text-muted-foreground">
                    {folder.count}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={index}
              href="#"
              className={cn(
                'flex items-center justify-between rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                index === 0 && 'bg-muted font-semibold text-foreground'
              )}
            >
              <div className="flex items-center gap-3">
                <folder.icon className="h-5 w-5" />
                {folder.name}
              </div>
              {folder.count && (
                <span className="text-xs font-semibold">{folder.count}</span>
              )}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
