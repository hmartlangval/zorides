import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-accent-500 to-pink-500">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center text-white">
          {/* Hero Section */}
          <h1 className="text-6xl font-bold mb-6 animate-fade-in">
            🎉 Zorides
          </h1>
          <p className="text-2xl mb-4 font-semibold">
            Find Friends for Every Event
          </p>
          <p className="text-lg mb-12 opacity-90">
            Never attend events alone again. Connect with like-minded people,
            create attendant groups, and make every event memorable.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mb-16">
            <Link href="/login">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-gray-100">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="glass-effect p-6 rounded-xl">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">Create Events</h3>
              <p className="opacity-90">
                Host events and let others know you&apos;re looking for company
              </p>
            </div>

            <div className="glass-effect p-6 rounded-xl">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Find Groups</h3>
              <p className="opacity-90">
                Join attendant groups based on your preferences and interests
              </p>
            </div>

            <div className="glass-effect p-6 rounded-xl">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="opacity-90">
                Chat with potential companions and plan together
              </p>
            </div>
          </div>

          {/* Demo Credentials */}
          <div className="mt-16 glass-effect p-6 rounded-xl text-left max-w-md mx-auto">
            <h3 className="text-lg font-semibold mb-3">🔑 Demo Credentials (V1)</h3>
            <div className="space-y-2 text-sm opacity-90">
              <p><strong>Email:</strong> alice@demo.com | bob@demo.com | charlie@demo.com</p>
              <p><strong>Password:</strong> password123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
