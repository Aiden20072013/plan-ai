import Link from "next/link";

export default function ForbiddenPage() {
    return (
        <main className="p-3 flex justify-center items-center">
            <div className="flex flex-col items-center justify-center m-4 gap-2">
                <div className="text-5xl font-semibold">403 Forbidden</div>
                <div>
                    <Link 
                        href="/dashboard"
                        className="opacity-80"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </main>
    )
}