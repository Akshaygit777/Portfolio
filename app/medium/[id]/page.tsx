import { fetchMediumPosts, MediumPost } from '@/lib/fetchMediumFeed';
import { Suspense } from 'react';
import BlogPostContent from './BlogPostContent';
import { Loader2 } from 'lucide-react';

interface BlogPostPageProps {
    params: Promise<{ id: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const resolvedParams = await params;
    const posts: MediumPost[] = await fetchMediumPosts();
    const post = posts[parseInt(resolvedParams.id)];

    return (
        <div className="container max-w-4xl mx-auto px-6 py-10 min-h-screen bg-card">
            <Suspense
                fallback={
                    <div className="flex flex-col items-center justify-center h-64">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        <p className="mt-4 text-muted-foreground">Loading blog post...</p>
                    </div>
                }
            >
                <BlogPostContent post={post} />
            </Suspense>
        </div>
    );
}