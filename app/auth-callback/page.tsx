'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaCopy } from 'react-icons/fa';
import Link from 'next/link';

function AuthCallbackContent() {
  const searchParams = useSearchParams();
  const refreshToken = searchParams.get('refresh_token');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (refreshToken) {
      try {
        await navigator.clipboard.writeText(refreshToken);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  return (
    <Card className="max-w-2xl w-full font-NHassDisplay">
      <CardHeader>
        <CardTitle className='text-center text-4xl tracking-wider'>Spotify Authentication</CardTitle>
      </CardHeader>
      <CardContent>
        {refreshToken ? (
          <div>
            <p className="mb-4 text-lg">
              Please copy the refresh token below and add it to your{' '}
              <code className='mx-1 bg-blue-900 rounded-sm p-1 font-SpaceGrotesk'>.env.local or .env</code> file as{' '}
              <code className='mx-1 bg-green-900 rounded-sm p-1 font-SpaceGrotesk'>SPOTIFY_REFRESH_TOKEN:</code>
            </p>
            <div className="flex items-center gap-2 bg-background/60 p-4 rounded-lg">
              <code className="font-SpaceGrotesk break-all">
                {refreshToken}
              </code>
              <button
                onClick={handleCopy}
                className="p-2 text-foreground/60 hover:text-foreground"
                title="Copy to clipboard"
              >
                <FaCopy className='size-6 cursor-pointer'/>
              </button>
            </div>
            {copied && <p className="text-green-600 mt-2">Copied to clipboard!</p>}
            <p className="mt-4 text-center">
              After adding the token, visit{' '}
              <Link href="/" className="text-blue-600 hover:underline">
                the home page
              </Link>
              .
            </p>
          </div>
        ) : (
          <p>
            Error: No refresh token received. Please try authenticating again.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function AuthCallback() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#1F1F1F] p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <AuthCallbackContent />
      </Suspense>
    </main>
  );
}