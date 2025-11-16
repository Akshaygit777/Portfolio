import { parseStringPromise } from 'xml2js';

export interface MediumPost {
    title: string;
    link: string;
    pubDate: string;
    creator: string;
    description: string;
    categories: string[];
}

export async function fetchMediumPosts(): Promise<MediumPost[]> {
    try {
        // Fetch the RSS feed
        const response = await fetch('https://medium.com/feed/@calmnerd', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch Medium feed: ${response.statusText}`);
        }

        const xml = await response.text();

        // Parse the XML
        const result = await parseStringPromise(xml);

        // Extract posts from the parsed XML
        const items = result.rss.channel[0].item;

        type MediumFeedItem = {
            title: string[];
            link: string[];
            pubDate: string[];
            'dc:creator': string[];
            'content:encoded': string[];
            category?: string[];
        };

        return items.map((item: MediumFeedItem) => ({
            title: item.title[0],
            link: item.link[0],
            pubDate: item.pubDate[0],
            creator: item['dc:creator'][0],
            description: item['content:encoded'][0],
            categories: item.category ? item.category.map((cat: string) => cat) : [],
        }));
    } catch (error) {
        console.error('Error fetching Medium feed:', error);
        return [];
    }
}