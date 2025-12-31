# @arsbreeze/interactive

## Project Overview

This is a React library that provides a unified API for managing overlay components (dialogs, sheets, drawers, confirmations, and toasts) without needing to embed individual components throughout your application.

**Key Value Proposition**: Simplifies overlay management by providing a single hook `useInteractive()` instead of managing multiple individual overlay components.

## Project Structure

This is a pnpm monorepo workspace with the following packages:

```
/
├── packages/
│   ├── interactive/     # Main library package
│   └── demo/            # Demo/example application
├── package.json         # Root workspace configuration
├── pnpm-workspace.yaml  # pnpm workspace definition
└── README.md           # User-facing documentation
```

## Technology Stack

- **Package Manager**: pnpm (workspace setup)
- **Language**: TypeScript
- **Framework**: React
- **UI Primitives**:
  - `@radix-ui/react-dialog` (for Sheet and Dialog components)
  - `vaul` (for Drawer/bottom sheet)
  - `sonner` (for toasts)
- **Styling**: Tailwind CSS v4
- **Build Tool**: tsup

## Core Features

1. **Unified API**: Single `useInteractive()` hook for all overlay types
2. **Component Injection**: Pass custom React components to render inside overlays
3. **Overlay Types**:
   - Sheets (sidebar overlays from right)
   - Drawers (bottom sheet overlays from below)
   - Dialogs (centered modal overlays)
   - Confirmation prompts (promisified)
   - Toasts (notifications)
4. **TypeScript**: Fully typed
5. **Promisified Confirmations**: Async/await support for confirmation dialogs

## Setup Requirements

Users need to:
1. Install the package: `pnpm add @arsbreeze/interactive`
2. Install peer dependencies: `react`, `sonner`
3. Wrap app with `<InteractiveProvider>`
4. Add `<Toaster />` component from sonner for toast support

## API Surface

The `useInteractive()` hook (aliased as `$` in examples) provides:

- `$.dialog(Component, props, config)` - Open modal dialog
- `$.drawer(Component, props, config)` - Open bottom sheet
- `$.sheet(Component, props, config)` - Open sidebar sheet
- `$.confirm(message, config)` - Show confirmation dialog (returns Promise<boolean>)
- `$.toast(message, config)` - Show toast notification
- `$.clear()` - Close all overlays

## Configuration Types

Each overlay type accepts a configuration object:

- **BaseInteractiveConfig**: `dismissible`, `className`, `title`
- **SheetConfig**: extends Base + `resizable`, `width`
- **DrawerConfig**: extends Base + `width`
- **DialogConfig**: extends Base + `centered`, `width`
- **ConfirmConfig**: extends Dialog + `cancelText`, `okText`, `variant`, `danger`, `onComplete`, `onAbort`

## Development Commands

- `pnpm build` - Build all packages
- `pnpm dev` - Run development mode for all packages
- `pnpm lint` - Lint all packages

## Architecture Details

### State Management
- Uses React Context (`InteractiveProvider`) to manage overlay state
- Single `isOpen` boolean + single `overlayState` object
- **Limitation**: Only one overlay can be active at a time (no stacking)

### Component Lifecycle
- Components receive `onComplete` and `onAbort` callbacks via props
- Calling these callbacks closes the overlay and triggers any user-provided callbacks
- All overlay containers (Sheet, Drawer, Dialog x2) are always mounted in DOM, toggled via `open` prop

### File Structure
```
packages/interactive/src/
├── index.tsx                    # Main provider, context, and hook
├── index.css                    # Tailwind styles
├── components/
│   ├── confirm.tsx              # Confirmation dialog content component
│   └── ui/
│       ├── sheet.tsx            # Radix Dialog wrapper (right side)
│       ├── drawer.tsx           # Vaul wrapper (bottom)
│       ├── dialog.tsx           # Radix Dialog wrapper (centered)
│       └── button.tsx           # Button component
└── lib/
    └── utils/
        └── cn.ts                # Tailwind class merging utility
```

## Known Issues

### Documentation
- README.md line 78: Typo "tiele" should be "title"
- ConfirmConfig has both `danger?` and `variant?` properties (inconsistent naming)

### Technical Limitations
1. **No overlay stacking**: Can't show a confirmation dialog on top of an open sheet
2. **Memory**: `overlayState` keeps component references even when closed (potential leak)
3. **Naming confusion**: "Sheet" (sidebar) vs "Drawer" (bottom) is opposite of common UI conventions
4. **Width helper**: `makeWidth()` function has unused parameter (index.tsx:281)
5. **No error boundaries**: Component render errors could crash the provider
6. **No cleanup on unmount**: Overlay state isn't cleared when provider unmounts

### TypeScript Config
- Next.js plugin present in tsconfig despite being a library package (likely copy-paste artifact)

## Performance Considerations

- All 4 overlay containers always rendered (4 portals in DOM)
- No memoization of injected components (full re-mount on state change)
- No rate limiting on API calls

## Comparison to Alternatives

**Strengths vs. direct Radix/Vaul usage:**
- Much simpler API
- No need to manage open/close state in components
- Promisified confirmations

**Limitations vs. full-featured solutions:**
- Can't stack multiple overlays
- Less flexible than direct primitive usage
- Single overlay at a time only

## Recommendations for Improvement

1. **Critical**: Fix naming (sheet/drawer) to match industry standards or document clearly
2. **Important**: Support overlay stacking (array of overlay states instead of single)
3. **Important**: Add cleanup to prevent memory leaks
4. **Nice to have**: Add error boundaries
5. **Nice to have**: Remove Next.js plugin from tsconfig
6. **Nice to have**: Reconcile `danger`/`variant` naming inconsistency
