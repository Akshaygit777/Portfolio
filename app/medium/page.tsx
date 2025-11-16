import { fetchMediumPosts, MediumPost } from '@/lib/fetchMediumFeed';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default async function MediumBlogs() {
    const posts: MediumPost[] = await fetchMediumPosts();

    return (
        <div className="container max-w-4xl mx-auto p-6 min-h-screen bg-background font-SpaceGrotesk">
            <h1 className="relative text-xl sm:text-3xl md:text-4xl text-center font-bold mb-10 py-1">
                <Link href="/" replace>
                    <button className="absolute left-0 top-0 w-fit h-full shrink-0 cursor-pointer z-40 rounded-lg sm:px-4 px-3 bg-background hover:bg-blue-900/70 flex items-center justify-center disabled:opacity-50">
                        <ArrowLeft className="h-6 w-6 text-foreground" />
                    </button>
                </Link>
                Medium Blogs
            </h1>
            {/* <h1 className="text-4xl font-bold mb-8 text-center text-white">Medium Blogs</h1> */}
            <Suspense
                fallback={
                    <div className="flex flex-col items-center justify-center h-64">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="mt-4 text-muted-foreground">Loading blogs...</p>
                    </div>
                }
            >
                <ul className="list-disc pl-5 space-y-4">
                    {posts.map((post, index) => (
                        <li key={index} className="marker:text-muted-foreground">
                            <div className="flex flex-row items-center gap-2">
                                <div className="hidden md:block text-sm text-muted-foreground font-mono w-24">
                                    {formatDate(post.pubDate)}
                                </div>
                                <span className="hidden md:block text-muted-foreground">:</span>
                                <Link href={`/medium/${index}`}
                                    className="text-base text-blue-500 font-medium text-left hover:underline hover:cursor-pointer"
                                >
                                    {post.title}
                                </Link>
                            </div>
                        </li>
                    ))}
                </ul>

                {!posts?.length && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No posts found.</p>
                    </div>
                )}
            </Suspense>
        </div>
    );
}


// Helper function to format dates
function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}