'use client'

import {
  ComponentType,
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react'
import { toast as sonner } from 'sonner'
import { ConfirmContent } from './components/confirm'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from './components/ui/drawer'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from './components/ui/sheet'
import { VisuallyHidden } from './components/ui/visually-hidden'
import { cn } from './lib/utils'

export interface BaseInteractiveConfig {
  dismissible?: boolean
  className?: string
  title?: string
}

export interface SheetConfig extends BaseInteractiveConfig {
  width?: number | string
  resizable: boolean
}

export interface DrawerConfig extends BaseInteractiveConfig {
  width?: number | string
}

export interface DialogConfig extends BaseInteractiveConfig {
  width?: number | string
  centered?: boolean
}

export interface ConfirmConfig extends DialogConfig {
  title?: string
  danger?: boolean
  cancelText?: string
  okText?: string
  onComplete?: () => void
  onAbort?: () => void
}

export interface ToastOptions extends BaseInteractiveConfig {
  type: 'info' | 'success' | 'warning' | 'error'
  duration?: number
}

/**
 * enforce that interactive content components have onAbort and onComplete props
 */
export type InteractiveContentProps = {
  onAbort?: () => void
  onComplete?: () => void
};

/**
 * generic type of the content component
 */
export type MakeInteractiveContentProps<T extends object> = T &
  InteractiveContentProps
/*
 * Comppnents that embed into interactive overlays
 **/
export type InteractiveContent<T extends object> = ComponentType<
  MakeInteractiveContentProps<T>
>;

interface InteractiveContextType {
  /**
   * open a sheet (from bottom)
   */
  sheet: <T extends object>(
    component: InteractiveContent<T>,
    props?: T,
    config?: SheetConfig
  ) => void
  /**
   * open a drawer (from right)
   * @param component
   * @param props
   * @param config
   * @returns
   */
  drawer: <T extends object>(
    component: InteractiveContent<T>,
    props?: T,
    config?: DrawerConfig
  ) => void
  /**
   * open a dialog (centered)
   * @param component
   * @param props
   * @param config
   * @returns
   */
  dialog: <T extends object>(
    component: InteractiveContent<T>,
    props?: T,
    config?: DialogConfig
  ) => void
  /**
   * open a confirmation dialog
   * @param message
   * @param config
   */
  confirm(
    message: string | ReactNode,
    config: ConfirmConfig & { onComplete: () => void }
  ): void
  confirm(
    message: string | ReactNode,
    config?: Omit<ConfirmConfig, 'onComplete'>
  ): Promise<boolean>
  /**
   * display a toast message
   * @param message
   * @param config
   */
  toast: (message: string, config?: ToastOptions) => void
  clear: () => void
}

const InteractiveContext = createContext<InteractiveContextType | null>(null)

interface InteractiveProviderProps {
  children: ReactNode
}

type OverlayType = 'sheet' | 'drawer' | 'dialog' | 'confirm'

interface OverlayState {
  type: OverlayType;
  component: InteractiveContent<any>
  props?: any
  config?: SheetConfig | DrawerConfig | DialogConfig | ConfirmConfig
}

export const InteractiveProvider = ({ children }: InteractiveProviderProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [overlayState, setOverlayState] = useState<OverlayState | null>(null)

  /**
   * opens a sheet (from below)
   * @param Component
   * @param props
   * @param config
   */
  const sheet = <T extends object>(
    component: InteractiveContent<T>,
    props?: T,
    config?: SheetConfig
  ) => {
    setOverlayState({ type: 'sheet', component, props, config })
    setIsOpen(true)
  }

  /**
   * opens a drawer (from side)
   * @param Component
   * @param props
   * @param config
   */
  const drawer = <T extends object>(
    component: InteractiveContent<T>,
    props?: T,
    config?: DrawerConfig
  ) => {
    setOverlayState({ type: 'drawer', component, props, config })
    setIsOpen(true)
  }

  /**
   * opens a dialog (always centered)
   * @param Component
   * @param props
   * @param config
   */
  const dialog = <T extends object>(
    component: InteractiveContent<T>,
    props?: T,
    config?: DialogConfig
  ) => {
    setOverlayState({ type: 'dialog', component, props, config })
    setIsOpen(true)
  }

  /**
   * opens a confirmation dialog
   * @param message
   * @param config
   * @returns
   */
  function confirm(message: string | ReactNode, config: ConfirmConfig): void
  function confirm(
    message: string | ReactNode,
    config?: Omit<ConfirmConfig, 'onComplete'>
  ): Promise<boolean>;
  function confirm(
    message: string | ReactNode,
    config?: ConfirmConfig
  ): Promise<boolean> | void {
    if (config?.onComplete) {
      // return void when onComplete provided
      setOverlayState({
        type: 'confirm',
        component: ConfirmContent,
        props: {
          message,
          config,
          onComplete: config?.onComplete,
          onAbort: config?.onAbort,
        },
        config,
      });
      setIsOpen(true)
      return void 0
    }
    // return a promise when no onComplete provided
    return new Promise<boolean>((resolve) => {
      const onComplete = () => {
        setIsOpen(false)
        resolve(true)
      }
      const onAbort = () => {
        setIsOpen(false);
        resolve(false);
      }
      const dummyProps = {};
      setOverlayState({
        type: 'confirm',
        component: ConfirmContent,
        props: {
          message,
          config,
          onComplete,
          onAbort,
        },
        config,
      })
      setIsOpen(true);
    })
  }

  /**
   * opens a toast
   * @param message
   * @param config
   */
  const toast = (message: string, config?: ToastOptions) => {
    const type = config?.type || 'info';
    switch (type) {
      case 'success':
        sonner.success(message, config);
        break
      case 'warning':
        sonner.warning(message, config);
        break
      case 'error':
        sonner.error(message, config);
        break
      default:
        sonner.info(message, config);
        break
    }
  }

  /**
   * close all the overlays
   */
  const clear = () => {
    setIsOpen(false)
  };

  const {
    type,
    component: ContentComponent,
    props,
    config,
  } = overlayState || {}

  // Helper to handle dismissal prevention for Radix (Sheet/Dialog)
  const handleInteractOutside = (e: any) => {
    if (config?.dismissible === false) {
      e.preventDefault()
    }
  }

  const handleEscapeKeyDown = (e: any) => {
    if (config?.dismissible === false) {
      e.preventDefault()
    }
  };

  const onComplete = () => {
    clear()
    props?.onComplete?.()
  };

  const onAbort = () => {
    clear()
    props?.onAbort?.()
  };

  const makeWidth = (value?: number | string) => {
    return value
      ? {
          width: typeof value === 'number' ? `${value}px` : value,
        }
      : {}
  };

  // Helper for Vaul (Drawer) dismissal
  const isDismissible = config?.dismissible !== false

  return (
    <InteractiveContext.Provider
      value={{ sheet, drawer, dialog, confirm, toast, clear }}
    >
      {children}
      <Sheet
        open={isOpen && type === 'sheet'}
        onOpenChange={setIsOpen}
        dismissible={isDismissible}
      >
        <SheetContent
          className={cn(
            'interactive-sheet sm:max-w-[100vw]',
            config?.className
          )}
          onInteractOutside={handleInteractOutside}
          onEscapeKeyDown={handleEscapeKeyDown}
          style={{
            ...makeWidth(config?.width),
          }}
        >
          {config?.title ? (
            <SheetHeader className='flex flex-row items-center justify-between'>
              <SheetTitle>{config?.title}</SheetTitle>
            </SheetHeader>
          ) : (
            <VisuallyHidden>
              <SheetTitle>Sheet</SheetTitle>
            </VisuallyHidden>
          )}
          {type === 'sheet' && ContentComponent && (
            <ContentComponent
              {...props}
              onAbort={onAbort}
              onComplete={onComplete}
            />
          )}
        </SheetContent>
      </Sheet>
      <Drawer open={isOpen && type === 'drawer'} onOpenChange={setIsOpen}>
        <DrawerContent
          className={cn('interactive-drawer flex-col', config?.className)}
          side={'right'}
          onInteractOutside={handleInteractOutside}
          onEscapeKeyDown={handleEscapeKeyDown}
          style={{
            ...makeWidth(config?.width),
          }}
        >
          {config?.title ? (
            <DrawerHeader className={cn(config?.title ? '' : 'hidden')}>
              <DrawerTitle>{config?.title}</DrawerTitle>
            </DrawerHeader>
          ) : (
            <VisuallyHidden>
              <DrawerTitle>Drawer</DrawerTitle>
            </VisuallyHidden>
          )}
          {type === 'drawer' && ContentComponent && (
            <ContentComponent
              {...props}
              onAbort={onAbort}
              onComplete={onComplete}
            />
          )}
        </DrawerContent>
      </Drawer>
      <Dialog open={isOpen && type === 'dialog'} onOpenChange={setIsOpen}>
        <DialogContent
          className={cn('interactive-dialog', config?.className)}
          onInteractOutside={handleInteractOutside}
          onEscapeKeyDown={handleEscapeKeyDown}
          style={{
            ...makeWidth(config?.width),
          }}
        >
          {config?.title ? (
            <DialogHeader>
              <DialogTitle>{config?.title}</DialogTitle>
            </DialogHeader>
          ) : (
            <VisuallyHidden>
              <DialogTitle>Dialog</DialogTitle>
            </VisuallyHidden>
          )}
          {type === 'dialog' && ContentComponent && (
            <ContentComponent
              {...props}
              onAbort={onAbort}
              onComplete={onComplete}
            />
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isOpen && type === 'confirm'} onOpenChange={setIsOpen}>
        <DialogContent
          className={cn('interactive-confirm', config?.className)}
          onInteractOutside={handleInteractOutside}
          onEscapeKeyDown={handleEscapeKeyDown}
        >
          <DialogHeader>
            <DialogTitle>{config?.title || 'Confirm'}</DialogTitle>
          </DialogHeader>
          {type === 'confirm' && ContentComponent && (
            <ContentComponent
              {...props}
              onAbort={onAbort}
              onComplete={onComplete}
            />
          )}
        </DialogContent>
      </Dialog>
    </InteractiveContext.Provider>
  )
}

/**
 * @description call this hook to open an interactive component
 * @usage
 * const $ = useInteractive()
 * $.sheet(<Component>, props, config)
 * $.drawer(<Component>, props, config)
 * $.dialog(<Component>, props, config)
 * $.confirm("Are you sure?", config)
 * @returns
 */
export const useInteractive = () => {
  const context = useContext(InteractiveContext)
  if (!context) {
    throw new Error('useInteractive must be used within a InteractiveProvider')
  }
  return context
}
