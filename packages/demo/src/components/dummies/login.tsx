'use client'

import { useActionState, useEffect, useRef } from 'react'
import { InteractiveContentProps, useInteractive } from '@arsbreeze/interactive'
import { loginAction } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export type LoginProps = {}

export const Login = ({
  onComplete,
  onAbort
}: InteractiveContentProps & {}) => {
  const { toast } = useInteractive()
  const [state, action, isPending] = useActionState(loginAction, {})
  const lastProcessedTimestamp = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (state.timestamp && state.timestamp !== lastProcessedTimestamp.current) {
      lastProcessedTimestamp.current = state.timestamp
      if (state.success) {
        console.log('Login successful')
        toast('Login successful', { type: 'success' })
        onComplete?.()
      } else if (state.message) {
        toast(state.message, { type: 'error' })
      }
    }
  }, [state, toast, onComplete])

  return (
    <div className="">
      <p className="pb-4 text-sm text-muted-foreground">
        Enter your credentials to access your account.
      </p>
      <form action={action} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            placeholder="m@example.com" 
            defaultValue=""
          />
          {state.errors?.email && (
            <p className="text-sm font-medium text-destructive">
              {state.errors.email[0]}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            defaultValue=""
          />
          {state.errors?.password && (
            <p className="text-sm font-medium text-destructive">
              {state.errors.password[0]}
            </p>
          )}
        </div>
        {state.message && !state.success && !state.errors && (
          <div className="text-sm font-medium text-destructive">
            {state.message}
          </div>
        )}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onAbort}
            disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Logging in...' : 'Log in'}
          </Button>
        </div>
      </form>
    </div>
  )
}
