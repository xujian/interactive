# @arsbreeze/interactive

Maybe you don't need to embed your own *Dialog*, or Drawer, or Sheet, or Confirmation, or Toast.

## Features

- **Unified API**: Manage all your overlays with a single hook `useInteractive()`.
- **Component Injection**: Pass your own React components to be rendered inside overlays.
- **Flexible**: Supports Sheets (sidebar), Drawers (bottom sheet), Dialogs (modals), Confirmation prompts, and Toasts.
- **TypeScript**: Fully typed for excellent developer experience.
- promisified `confirm()`: Awaitable confirmation dialogs.

## Installation

```bash
pnpm add @arsbreeze/interactive
```

Make sure you also have the peer dependencies installed:
 * react
 * sonner

## Setup

Wrap your application (or the part of it that needs interactive features) with `InteractiveProvider`.

```tsx
import { InteractiveProvider } from '@arsbreeze/interactive';
import { Toaster } from 'sonner';

function App() {
  return (
    <InteractiveProvider>
      <YourApp />
      <Toaster /> {/* Required for toasts */}
    </InteractiveProvider>
  );
}
```

## Usage

Use the `useInteractive` hook to trigger overlays from anywhere in your component tree.

```tsx
import { useInteractive } from '@arsbreeze/interactive';
import MyForm from './MyForm';

function MyComponent() {
  const $ = useInteractive();

  const handleOpenSheet = () => {
    $.sheet(MyForm, { someProp: 'value' }, { title: 'Edit Profile' });
  };

  const handleConfirm = async () => {
    const confirmed = await $.confirm('Are you sure you want to delete this?', {
      danger: true,
      okText: 'Delete',
    })
    if (confirmed) {
      $.toast("Item deleted!", { type: 'success' });
    }
  }

  return (
    <div className="flex gap-4">
      <button onClick={handleOpenSheet}>Open Key Form</button>
      <button onClick={handleConfirm}>Delete Item</button>
    </div>
  )
}
```

## API Reference
```tsx
$.dialog(DialogContent, {}, {
  title: 'Edit profile',
  centered: true,
})
```
```tsx
$.drawer(DialogContent, {}, {
  width: 400,
})
```
```tsx
$.sheet(DialogContent, {}, {
  resizable: true,
})
```
```tsx
$.confirm('Are you sure you want to delete this?', {
  danger: true,
  okText: 'Delete',
})
```
```tsx
$.toast("Item deleted!", { type: 'success' });
```

## Types

### Configuration Interfaces

```tsx
interface BaseInteractiveConfig {
  dismissible?: boolean;
  className?: string;
  title?: string;
}

interface SheetConfig extends BaseInteractiveConfig {
  resizable: boolean;
}

interface DrawerConfig extends BaseInteractiveConfig {
  width: number;
}

interface DialogConfig extends BaseInteractiveConfig {
  centered?: boolean;
  width?: number;
}

interface ConfirmConfig extends DialogConfig {
  title?: string;
  cancelText?: string;
  okText?: string;
  danger?: boolean;
  onComplete?: () => void;
  onAbort?: () => void;
}
```
