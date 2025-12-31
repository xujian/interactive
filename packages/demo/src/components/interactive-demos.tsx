'use client'

import { useInteractive } from '@arsbreeze/interactive'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Login } from '@/components/dummies/login'
import { ActivityGoal } from '@/components/dummies/activity-goal'
import { OrderDetails } from '@/components/dummies/order-details'
import { Highlight, themes } from 'prism-react-renderer'

const DemoSection = ({
  title,
  description,
  code,
  onRun
}: {
  title: string
  description: string
  code: string
  onRun: () => void
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-hidden rounded-lg bg-[#272822] p-4">
          <Button
            onClick={() => navigator.clipboard.writeText(code)}
            className="absolute right-0 top-0 text-xs text-zinc-400 hover:text-white">
            Copy
          </Button>
          <Highlight theme={themes.okaidia} code={code} language="tsx">
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={`overflow-x-auto font-mono text-xs ${className}`}
                style={style}>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onRun}>Run Demo</Button>
      </CardFooter>
    </Card>
  )
}

export const InteractiveDemos = () => {
  const $ = useInteractive()

  const demos = [
    {
      title: 'Sheet',
      description: 'A bottom-sheet drawer often used on mobile.',
      code: `$.sheet(
  ActivityGoal,
  { user: '8adc9b2f64681d62' },
  {
    dismissible: true,
    resizable: true
  }
)`,
      run: () =>
        $.sheet(
          ActivityGoal,
          { user: '8adc9b2f64681d62' },
          {
            title: '',
            resizable: true
          }
        )
    },
    {
      title: 'Drawer',
      description: 'A side-sheet overlay that slides in from the edge.',
      code: `$.drawer(
  OrderDetails, 
  { id: 'bebe5d3a04d737b6' },
  {
    title: 'Order details', 
    width: '80vw',
    dismissible: true,
  }
)`,
      run: () =>
        $.drawer(
          OrderDetails,
          { id: 'bebe5d3a04d737b6' },
          {
            title: 'Order details',
            width: '80vw',
            dismissible: true,
          }
        )
    },
    {
      title: 'Dialog',
      description: 'A modal dialog for focused interactions.',
      code: `$.dialog(
  Login,
  {},
  {
    title: 'Login',
    width: 400
  }
)`,
      run: () =>
        $.dialog(
          Login,
          {},
          {
            title: 'Login',
            width: 600
          }
        )
    },
    {
      title: 'Confirm',
      description: 'A promise-based confirmation dialog.',
      code: `const result = await $.confirm(
  'Are you sure to delete the address?', 
  {
    title: 'Please confirm',
    danger: true,
    okText: 'Delete',
    cancelText: 'Wait a minute'
  }
)
if (result) {
  $.toast('Confirmed!', { type: 'success' })
} else {
  $.toast('Cancelled', { type: 'info' })
}`,
      run: async () => {
        const result = await $.confirm('Are you sure to delete the address?', {
        title: 'Please confirm',
        danger: true,
        okText: 'Delete',
        cancelText: 'Wait a minute'
        })
        if (result) {
          $.toast('Address has been deleted', { type: 'success' })
        } else {
          $.toast('Cancelled', { type: 'info' })
        }
      }
    },
    {
      title: 'Toast',
      description: 'A brief notification message.',
      code: `$.toast('This is a success toast', { type: 'success' })`,
      run: () => $.toast('This is a success toast', { type: 'success' })
    }
  ]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">Demos of @arsbreeze/interactive</h1>
      <p className="text-gray-500">
        Examples of using the interactive hook for various overlays.
      </p>
      {demos.map((demo, i) => (
        <DemoSection
          key={i}
          title={demo.title}
          description={demo.description}
          code={demo.code}
          onRun={demo.run}
        />
      ))}
    </div>
  )
}
