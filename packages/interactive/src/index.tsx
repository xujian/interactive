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
export type InteractiveContentRootProps = {
  onAbort?: () => void
  onComplete?: () => void
};

/**
 * generic type of the content component
 */
export type InteractiveContentProps<T extends {}> = T &
  InteractiveContentRootProps
/*
 * Comppnents that embed into interactive overlays
 **/
export type InteractiveContent<T extends {}> = ComponentType<
  InteractiveContentProps<T>
>;

interface InteractiveContextType {
  /**
   * open a sheet (from bottom)
   */
  sheet: <T extends {}>(
    component: InteractiveContent<T>,
    props?: InteractiveContentProps<T>,
    config?: SheetConfig
  ) => void
  /**
   * open a drawer (from right)
   * @param component
   * @param props
   * @param config
   * @returns
   */
  drawer: <T extends {}>(
    component: InteractiveContent<T>,
    props?: InteractiveContentProps<T>,
    config?: DrawerConfig
  ) => void
  /**
   * open a dialog (centered)
   * @param component
   * @param props
   * @param config
   * @returns
   */
  dialog: <T extends {}>(
    component: InteractiveContent<T>,
    props?: InteractiveContentProps<T>,
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

interface CallbackPair {
  onComplete?: () => void
  onAbort?: () => void
}

export type OverlayType = 'dialog' | 'sheet' | 'drawer' | 'confirm'

interface OverlayState {
  callbacks: {
    [k in OverlayType]?: CallbackPair
  }
  components: {
    [k in OverlayType]?: InteractiveContent<any>
  }
  props: {
    [k in OverlayType]?: any
  }
  configs: {
    sheet?: SheetConfig
    drawer?: DrawerConfig
    dialog?: DialogConfig
    confirm?: ConfirmConfig
  }
}

export const InteractiveProvider = ({ children }: InteractiveProviderProps) => {
  const [state, setState] = useState<OverlayState>({
    callbacks: {},
    components: {},
    props: {},
    configs: {}
  })

  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const writeState = <T extends {}>(
    type: OverlayType,
    component: InteractiveContent<T>,
    props?: InteractiveContentProps<T>,
    config?: BaseInteractiveConfig
  ) => {
    setState((prev) => ({
      callbacks: {
        ...prev.callbacks,
        [type]: {
          onComplete: props?.onComplete,
          onAbort: props?.onAbort,
        },
      },
      components: {
        ...prev.components,
        [type]: component,
      },
      props: {
        ...prev.props,
        [type]: props,
      },
      configs: {
        ...prev.configs,
        [type]: config,
      },
    }))
  }

  const clearState = (type: OverlayType) => {
    setState((prev) => ({
      callbacks: {
        ...prev.callbacks,
        [type]: undefined,
      },
      components: {
        ...prev.components,
        [type]: undefined,
      },
      props: {
        ...prev.props,
        [type]: undefined,
      },
      configs: {
        ...prev.configs,
        [type]: undefined,
      },
    }))
  }

  const clear = () => {
    setIsSheetOpen(false)
    setIsDrawerOpen(false)
    setIsDialogOpen(false)
    setIsConfirmOpen(false)
    setState({
      callbacks: {},
      components: {},
      props: {},
      configs: {},
    })
  }

  /**
   * opens a sheet (from below)
   * @param Component
   * @param props
   * @param config
   */
  const sheet = <T extends object>(
    component: InteractiveContent<T>,
    props?: InteractiveContentProps<T>,
    config?: SheetConfig
  ) => {
    writeState('sheet', component, props, config)
    setIsSheetOpen(true)
  }

  /**
   * opens a drawer (from side)
   * @param Component
   * @param props
   * @param config
   */
  const drawer = <T extends object>(
    component: InteractiveContent<T>,
    props?: InteractiveContentProps<T>,
    config?: DrawerConfig
  ) => {
    writeState('drawer', component, props, config)
    setIsDrawerOpen(true)
  }

  /**
   * opens a dialog (always centered)
   * @param Component
   * @param props
   * @param config
   */
  const dialog = <T extends object>(
    component: InteractiveContent<T>,
    props?: InteractiveContentProps<T>,
    config?: DialogConfig
  ) => {
    writeState('dialog', component, props, config)
    setIsDialogOpen(true)
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
      writeState('confirm', ConfirmContent, { message, config }, config)
      setIsConfirmOpen(true)
      return void 0
    }

    return new Promise<boolean>((resolve) => {
      const onComplete = () => {
        setIsConfirmOpen(false)
        resolve(true)
      }
      const onAbort = () => {
        setIsConfirmOpen(false)
        resolve(false)
      }
      writeState(
        'confirm',
        ConfirmContent,
        {
          message,
          config,
          onComplete,
          onAbort,
        },
        config
      )
      setIsConfirmOpen(true)
    })
  }/**
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

  const getHandlers = (type: OverlayType) => {
    return {
      onComplete: () => {
        switch (type) {
          case 'dialog':
            setIsDialogOpen(false)
            break
          case 'sheet':
            setIsSheetOpen(false)
            break
          case 'drawer':
            setIsDrawerOpen(false)
            break
          case 'confirm':
            setIsConfirmOpen(false)
            break
        }
        state.props[type]?.onComplete?.()
      },
      onAbort: () => {
        switch (type) {
          case 'dialog':
            setIsDialogOpen(false)
            break
          case 'sheet':
            setIsSheetOpen(false)
            break
          case 'drawer':
            setIsDrawerOpen(false)
            break
          case 'confirm':
            setIsConfirmOpen(false)
            break
        }
        state.props[type]?.onAbort?.()
      },
    }
  }

  const ContentComponent = ({ type }: { type: OverlayType }) => {
    const Component = state.components[type]
    const props = state.props[type]
    const { onComplete, onAbort } = getHandlers(type)
    if (!Component) return null
    return (
      <Component {...props} onAbort={onAbort} onComplete={onComplete} />
    )
  }

  // Helper to handle dismissal prevention for Radix (Sheet/Dialog)
  const handleInteractOutside = (type: OverlayType) => (e: any) => {
    if (state.configs[type]?.dismissible === false) {
      e.preventDefault()
    }
  }

  const handleEscapeKeyDown = (type: OverlayType) => (e: any) => {
    if (state.configs[type]?.dismissible === false) {
      e.preventDefault()
    }
  };

  const makeWidth = (value?: number | string) => {
    return value
      ? {
          width: typeof value === 'number' ? `${value}px` : value,
        }
      : {}
  };

  return (
    <InteractiveContext.Provider
      value={{ sheet, drawer, dialog, confirm, toast, clear }}
    >
      {children}
      <Sheet
        open={isSheetOpen}
        onOpenChange={(value) => {
          if (value === false) {
            setIsSheetOpen(false)
            state.callbacks.sheet?.onAbort?.()
            clearState('sheet')
          }
        }}>
        <SheetContent
          className={cn(
            'interactive-sheet sm:max-w-[100vw]',
            state.configs.sheet?.className
          )}
          onInteractOutside={handleInteractOutside('sheet')}
          onEscapeKeyDown={handleEscapeKeyDown('sheet')}
          style={{
            ...makeWidth(state.configs.sheet?.width),
          }}>
          {state.configs.sheet?.title ? (
            <SheetHeader className='flex flex-row items-center justify-between'>
              <SheetTitle>{state.configs.sheet?.title}</SheetTitle>
            </SheetHeader>
          ) : (
            <VisuallyHidden>
              <SheetTitle>Sheet</SheetTitle>
            </VisuallyHidden>
          )}
          <ContentComponent type='sheet' />
        </SheetContent>
      </Sheet>
      <Drawer
        open={isDrawerOpen}
        onOpenChange={(value) => {
          if (value === false) {
            setIsDrawerOpen(false)
            state.callbacks.drawer?.onAbort?.()
            clearState('drawer')
          }
        }}>
        <DrawerContent
          className={cn('interactive-drawer xs:w-full sm:w-full md:w-3/4 lg:w-1/2 flex-col', state.configs.drawer?.className)}
          side={'right'}
          onInteractOutside={handleInteractOutside('drawer')}
          onEscapeKeyDown={handleEscapeKeyDown('drawer')}
          style={{
            ...makeWidth(state.configs.drawer?.width),
          }}>
          {state.configs.drawer?.title ? (
            <DrawerHeader className={cn(state.configs.drawer?.title ? '' : 'hidden')}>
              <DrawerTitle>{state.configs.drawer?.title}</DrawerTitle>
            </DrawerHeader>
          ) : (
            <VisuallyHidden>
              <DrawerTitle>Drawer</DrawerTitle>
            </VisuallyHidden>
          )}
          <ContentComponent type='drawer' />
        </DrawerContent>
      </Drawer>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(value) => {
          if (value === false) {
            setIsDialogOpen(false)
            state.callbacks.dialog?.onAbort?.()
            clearState('dialog')
          }
        }}>
        <DialogContent
          className={cn('interactive-dialog rounded-lg', state.configs.dialog?.className)}
          onInteractOutside={handleInteractOutside('dialog')}
          onEscapeKeyDown={handleEscapeKeyDown('dialog')}
          style={{
            ...makeWidth(state.configs.dialog?.width),
          }}>
          {state.configs.dialog?.title ? (
            <DialogHeader>
              <DialogTitle>{state.configs.dialog?.title}</DialogTitle>
            </DialogHeader>
          ) : (
            <VisuallyHidden>
              <DialogTitle>Dialog</DialogTitle>
            </VisuallyHidden>
          )}
          <ContentComponent type='dialog' />
        </DialogContent>
      </Dialog>
      <Dialog
        open={isConfirmOpen}
        onOpenChange={(value) => {
          if (value === false) {
            setIsConfirmOpen(false)
            state.callbacks.confirm?.onAbort?.()
            clearState('confirm')
          }
        }}>
        <DialogContent
          className={cn('interactive-confirm', state.configs.confirm?.className)}
          onInteractOutside={handleInteractOutside('confirm')}
          onEscapeKeyDown={handleEscapeKeyDown('confirm')}>
          <DialogHeader>
            <DialogTitle>{state.configs.confirm?.title || 'Confirm'}</DialogTitle>
          </DialogHeader>
          <ContentComponent type='confirm' />
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
