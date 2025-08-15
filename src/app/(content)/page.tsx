import { Button } from "@/components/ui/button";
import { getUser } from "@/utils/supabase/server";
import Link from "next/link";

export default async function Home() {

  const user = await getUser();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-3">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            <span className="block">Welcome to</span>
            <span className="block text-indigo-600">PlanAI</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Achieve your goals with personalized schedules. Create goals, build schedules, and track your progress. Our AI-powered scheduler helps you stay on track and achieve your dreams.
          </p>
          {!user ? (
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Button asChild>
                  <Link href="/auth/signup">
                    Get Started
                  </Link>
                </Button>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Button asChild variant="outline">
                  <Link href="/auth/login">
                    Log In
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-5 sm:mt-3 sm:ml-3">
              <Button asChild variant="outline">
                <Link href="/dashboard">
                  Dashboard
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-20 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Features</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Everything you need to stay organized and motivated.
          </p>
        </div>
        <div className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Goal Setting</h3>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              Define your goals and break them down into actionable steps.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">AI-Powered Scheduling</h3>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              Our AI creates optimized schedules based on your goals and availability.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Progress Tracking</h3>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              Monitor your progress and stay motivated with detailed analytics.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}