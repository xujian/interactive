'use client';

import * as React from 'react';
import { Drawer as VaulPrimitive } from 'vaul';

import { cn } from '../../lib/utils';

const Sheet = ({
  shouldScaleBackground = true,
  dismissible = true,
  ...props
}: React.ComponentProps<typeof VaulPrimitive.Root> & {
  dismissible?: boolean;
}) => (
  <VaulPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    dismissible={dismissible}
    {...props}
  />
);
Sheet.displayName = 'Sheet';

const SheetTrigger = VaulPrimitive.Trigger;

const SheetPortal = VaulPrimitive.Portal;

const SheetClose = VaulPrimitive.Close;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof VaulPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof VaulPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <VaulPrimitive.Overlay
    ref={ref}
    className={cn('fixed inset-0 z-50 bg-black/80', className)}
    {...props}
  />
));
SheetOverlay.displayName = VaulPrimitive.Overlay.displayName;

const SheetContent = React.forwardRef<
  React.ElementRef<typeof VaulPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof VaulPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <VaulPrimitive.Content
      ref={ref}
      className={cn(
        'fixed inset-x-0 bottom-0 z-50 mt-24 flex w-full h-auto flex-col items-center justify-center rounded-t-[10px] border bg-background',
        className
      )}
      {...props}
    >
      <div className='mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted' />
      {children}
    </VaulPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = 'SheetContent';

const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('grid gap-1.5 p-4 text-center sm:text-left', className)}
    {...props}
  />
);
SheetHeader.displayName = 'SheetHeader';

const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('mt-auto flex flex-col gap-2 p-4', className)}
    {...props}
  />
);
SheetFooter.displayName = 'SheetFooter';

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof VaulPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof VaulPrimitive.Title>
>(({ className, ...props }, ref) => (
  <VaulPrimitive.Title
    ref={ref}
    className={cn(
      'text-lg font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
SheetTitle.displayName = VaulPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof VaulPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof VaulPrimitive.Description>
>(({ className, ...props }, ref) => (
  <VaulPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
SheetDescription.displayName = VaulPrimitive.Description.displayName;

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
};
