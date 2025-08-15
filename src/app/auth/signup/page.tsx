import Link from 'next/link';
import { signup } from '../actions';

export default function SignupPage() {
  return (
    <main className="flex justify-center items-center min-h-screen">
        <form action={signup} className="flex flex-col gap-4 bg-muted p-5 w-3/4 rounded-md lg:w-1/2">
            <div className="text-center">ProjSkel Signup</div>
            <div>
                <label htmlFor="email" className="sr-only">Email:</label>
                <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="Email:"
                    className="w-full p-2"
                    required 
                />
            </div>
            <div>
                <label htmlFor="password" className="sr-only">Password:</label>
                <input 
                    id="password" 
                    name="password" 
                    type="password" 
                    placeholder="Password:"
                    className="w-full p-2"
                    required 
                />
            </div>
            <div className="flex flex-col items-center">
                <button>Sign up</button>
                <div>
                    Already have an account? <Link href="/auth/login" className="underline hover:opacity-80">Log in</Link>
                </div>
            </div>
        </form>
    </main>
  )
}