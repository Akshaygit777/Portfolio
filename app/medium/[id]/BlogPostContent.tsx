'use client'; // Mark this as a Client Component

import { MediumPost } from '@/lib/fetchMediumFeed';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { FaMedium } from "react-icons/fa6";

// Clean HTML description using the provided template function
const cleanDescription = (html: string) => {
    if (!html) return '';

    let cleaned = html.replace(/style="[^"]*"/g, '');

    cleaned = cleaned.replace(/<p/g, '<p class="mb-6 text-base leading-relaxed" ');
    cleaned = cleaned.replace(/<h1/g, '<h1 class="text-3xl font-bold mt-10 mb-4" ');
    cleaned = cleaned.replace(/<h2/g, '<h2 class="text-2xl font-bold mt-8 mb-4" ');
    cleaned = cleaned.replace(/<h3/g, '<h3 class="text-xl font-semibold mt-6 mb-3" ');
    cleaned = cleaned.replace(/<ul/g, '<ul class="list-disc pl-6 mb-6 space-y-2" ');
    cleaned = cleaned.replace(/<ol/g, '<ol class="list-decimal pl-6 mb-6 space-y-2" ');
    cleaned = cleaned.replace(/<li/g, '<li class="mb-1" ');
    cleaned = cleaned.replace(/<blockquote/g, '<blockquote class="border-l-4 border-green-600 pl-4 italic my-6" ');
    cleaned = cleaned.replace(/<img/g, '<img loading="lazy" class="max-w-full h-auto rounded-md my-8 mx-auto" ');
    cleaned = cleaned.replace(/<pre/g, '<pre class="relative my-6 bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto w-full" ');
    cleaned = cleaned.replace(/<code/g, '<code class="text-sm font-mono text-gray-100" ');
    cleaned = cleaned.replace(/<a/g, '<a class="text-blue-500 underline hover:text-blue-700" ');
    cleaned = cleaned.replace(/<iframe/g, '<div class="relative w-full max-w-full my-8"><iframe loading="lazy" class="w-full aspect-video rounded-md" ');
    cleaned = cleaned.replace(/<\/iframe>/g, '</iframe></div>');
    cleaned = cleaned.replace(/src="\/api\/image\?url=([^"]+)"/g, (match, url) => {
        return `src="${decodeURIComponent(url)}" onerror="this.onerror=null; this.src='/placeholder-image.jpg';"`;
    });

    return cleaned;
};

interface BlogPostContentProps {
    post: MediumPost | undefined;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
    if (!post) {
        return (
            <div>
                <Link
                    href="/medium"
                    replace
                    className="mb-8 px-0 flex items-center text-blue-500 hover:text-blue-700 hover:cursor-pointer hover:bg-transparent"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to blogs
                </Link>

                <div className="p-6 bg-background rounded-lg border border-destructive text-center">
                    <p className="text-destructive font-semibold">Blog post not found</p>
                    <p className="text-muted-foreground mt-2">The requested blog post could not be found.</p>
                    <Button />
                </div>
            </div>
        );
    }

    return (
        <>
            <Link
                href="/medium"
                replace
                className="mb-8 sticky top-1 backdrop-blur-md bg-card/40 w-fit z-30 py-2 px-4 rounded-lg flex items-center text-blue-500 hover:text-blue-700 hover:cursor-pointer hover:bg-transparent"
            >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to blogs
            </Link>

            <article className="prose dark:prose-invert max-w-none">
                <h1 className="text-4xl font-bold mb-8 leading-tight text-green-600">{post.title}</h1>

                <div className="flex items-center gap-4 mb-6 non-prose">
                    <div className="w-12 h-12 bg-muted rounded-full flex-shrink-0">
                        <Image src="/yoho.jpg" alt="dp" width={400} height={400} className="rounded-full border" />
                    </div>
                    <div className="grow flex items-center justify-between">
                        <div>
                            {/* <p className="font-semibold">{post.creator}</p> */}
                            <p className="font-semibold">Mohit Singh</p>
                            <p className="text-sm text-muted-foreground">Software Engineer</p>
                        </div>

                        <Button
                            asChild
                            variant="outline"
                            className="text-primary hover:text-primary/80 p-2"
                        >
                            <Link href={post.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                <FaMedium size={20} className="sm:mr-1" />
                                <span className="hidden sm:inline-flex">
                                    Read
                                    <span className="hidden lg:inline-flex">&nbsp;this article</span>
                                    &nbsp;on&nbsp;Medium
                                </span>
                                {/* <span className="">Medium</span> */}
                            </Link>

                        </Button>
                    </div>
                </div>

                <div className="text-sm text-muted-foreground mb-6 non-prose">
                    {new Date(post.pubDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                    })}
                </div>

                {post.categories && post.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-8 non-prose">
                        {post.categories.map((category, index) => (
                            <span key={index} className="px-3 py-1 text-xs bg-muted rounded-full">
                                {category}
                            </span>
                        ))}
                    </div>
                )}

                <div
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: cleanDescription(post.description || '') }}
                />
            </article>
        </>
    );
}