'use server'

import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export type LoginState = {
  success?: boolean
  message?: string
  errors?: {
    email?: string[]
    password?: string[]
  }
  timestamp?: number
}

export async function loginAction(
  prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  const validatedFields = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password')
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid fields',
      errors: validatedFields.error.flatten().fieldErrors,
      timestamp: Date.now()
    }
  }

  const { password } = validatedFields.data

  if (password !== 'password') {
    return {
      success: false,
      message: 'Invalid credentials. Try "password".',
      timestamp: Date.now()
    }
  }

  return {
    success: true,
    message: 'Login successful',
    timestamp: Date.now()
  }
}
