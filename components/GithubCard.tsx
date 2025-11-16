"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Card } from './ui/card';
import { fetchGitHubData, GitHubData, ContributionDay, } from '@/lib/github-data';
// import { fetchGitHubData, GitHubData, ContributionDay, MostUsedLanguage, AchievementBadge } from '@/lib/github-data';

const GithubCard: React.FC = () => {
    const [data, setData] = useState<GitHubData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hoveredDay, setHoveredDay] = useState<ContributionDay | null>(null);
    // const [graphDimensions, setGraphDimensions] = useState({ width: 0, height: 0 });
    const graphContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const githubData = await fetchGitHubData();
                setData(githubData);
            } catch {
                setError('Failed to load GitHub data. Please check your token and username.');
            }
        };
        loadData();
    }, []);

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <Card className="h-full w-full sm:max-h-[14.5rem] overflow-y-auto p-2 flex flex-col gap-2">
            {/* Contribution Graph Skeleton */}
            <div className='w-full'>
                {/* Month Labels Skeleton */}
                <div className="flex w-full mb-1 gap-4">
                    {[...Array(6)].map((_, index) => (
                        <div
                            key={index}
                            className="h-2 bg-gray-700 rounded animate-pulse"
                            style={{ width: `${100 / 6}%` }}
                        />
                    ))}
                </div>

                {/* Contribution Graph Skeleton */}
                <div className="w-full relative mb-2" style={{ aspectRatio: '52/7' }}>
                    <svg
                        width="100%"
                        height="100%"
                        viewBox="0 0 52 7"
                        preserveAspectRatio="xMidYMid meet"
                        className="overflow-visible"
                    >
                        {[...Array(52 * 7)].map((_, index) => {
                            const x = Math.floor(index / 7);
                            const y = (index % 7);
                            return (
                                <rect
                                    key={index}
                                    x={x}
                                    y={y}
                                    width="0.7"
                                    height="0.7"
                                    fill="#374151"
                                    stroke="#30363d"
                                    strokeWidth="0.04"
                                    rx="0.2"
                                    className="animate-pulse"
                                    style={{
                                        animationDelay: `${(index % 10) * 100}ms`,
                                        animationDuration: '1.5s'
                                    }}
                                />
                            );
                        })}
                    </svg>
                </div>

                {/* Total Contributions Text Skeleton */}
                <div className="w-full flex items-center justify-between">
                    <div className="h-2 bg-gray-700 rounded animate-pulse w-1/3" />
                    <div className="flex items-center gap-1">
                        <div className="h-2 bg-gray-700 rounded animate-pulse w-8" />
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, index) => (
                                <div
                                    key={index}
                                    className="w-1 h-1 bg-gray-700 rounded-sm animate-pulse"
                                />
                            ))}
                        </div>
                        <div className="h-2 bg-gray-700 rounded animate-pulse w-8" />
                    </div>
                </div>
            </div>

            <div className="flex w-full h-full flex-col items-start gap-2">
                {/* First Row - Profile and Stats */}
                <div className='grid grid-cols-2 gap-4 w-full h-full'>
                    {/* Profile Section Skeleton */}
                    <div className='bg-gray-800 px-2 rounded-lg flex items-center gap-2'>
                        <div className="w-12 h-12 bg-gray-700 rounded-full animate-pulse" />
                        <div className="flex-1">
                            <div className="h-3 bg-gray-700 rounded animate-pulse mb-1" />
                            <div className="h-2 bg-gray-700 rounded animate-pulse w-2/3 mb-1" />
                            <div className="flex items-center gap-1">
                                <div className="h-2 bg-gray-700 rounded animate-pulse w-16" />
                                <div className="hidden md:flex gap-1">
                                    {[...Array(3)].map((_, index) => (
                                        <div
                                            key={index}
                                            className="w-2 h-2 bg-gray-700 rounded-full animate-pulse"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section Skeleton */}
                    <div className='grid grid-cols-2 gap-4'>
                        <div className="rounded-lg bg-blue-500/20 p-2">
                            <div className="h-4 bg-gray-700 rounded animate-pulse mb-1" />
                            <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3" />
                        </div>
                        <div className="rounded-lg bg-amber-500/20 p-2">
                            <div className="h-4 bg-gray-700 rounded animate-pulse mb-1" />
                            <div className="h-3 bg-gray-700 rounded animate-pulse w-2/3" />
                        </div>
                    </div>
                </div>

                {/* Second Row - Language and Commits */}
                <div className='grid grid-cols-2 gap-4 w-full h-full'>
                    {/* Favorite Language Skeleton */}
                    <div className="flex justify-center flex-col h-full w-full bg-pink-400/30 px-2 rounded-lg">
                        <div className="h-2 bg-gray-700 rounded animate-pulse w-1/2 mb-1" />
                        <div className="h-3 bg-gray-700 rounded animate-pulse w-3/4" />
                    </div>

                    {/* Commits Skeleton */}
                    <div className="w-full flex items-center justify-start gap-4 h-full bg-cyan-500/20 rounded-lg px-2">
                        <div className="h-5 bg-gray-700 rounded animate-pulse w-8" />
                        <div className="h-3 bg-gray-700 rounded animate-pulse w-12" />
                    </div>
                </div>
            </div>
        </Card>
    );

    if (error) {
        return (
            <Card className="h-full w-full flex items-center justify-center p-4">
                <p className="text-red-500">{error}</p>
            </Card>
        );
    }

    if (!data) {
        return <LoadingSkeleton />;
    }

    const renderContributionGraph = (contributionData: ContributionDay[]) => {
        const daysInWeek = 7;
        const weeks = Math.ceil(contributionData.length / daysInWeek);

        // Calculate month labels
        const monthLabels: { label: string; x: number }[] = [];
        let currentMonth = '';
        contributionData.forEach((day, index) => {
            const date = new Date(day.date);
            const month = date.toLocaleString('en-US', { month: 'short' });
            const weekIndex = Math.floor(index / daysInWeek);
            if (month !== currentMonth) {
                currentMonth = month;
                monthLabels.push({ label: month, x: weekIndex });
            }
        });

        // Get total contributions
        const totalContributions = contributionData.reduce((sum, day) => sum + day.count, 0);

        const getColor = (level: number) => {
            switch (level) {
                case 0: return '#222831';
                case 1: return '#0e4429';
                case 2: return '#006d32';
                case 3: return '#26a641';
                case 4: return '#39d353';
                default: return '#161b22';
            }
        };

        return (
            <div className="flex flex-col h-full w-full">
                {/* Month Labels */}
                <div className="flex w-full mb-1">
                    {monthLabels.map((month, index) => (
                        <span
                            key={`${month.label}-${index}`}
                            className="text-[0.5rem] text-white/30"
                            style={{
                                width: `${100 / monthLabels.length}%`,
                                textAlign: index === 0 ? 'left' : index === monthLabels.length - 1 ? 'right' : 'center'
                            }}
                        >
                            {month.label}
                        </span>
                    ))}
                </div>

                {/* Contribution Graph */}
                <div className="w-full relative" style={{ aspectRatio: `${weeks}/${daysInWeek}` }}>
                    <svg
                        width="100%"
                        height="100%"
                        viewBox={`0 0 ${weeks} ${daysInWeek}`}
                        preserveAspectRatio="xMidYMid meet"
                        className="overflow-visible"
                    >
                        {contributionData.map((day, index) => {
                            const x = Math.floor(index / daysInWeek);
                            const y = (index % daysInWeek);
                            return (
                                <rect
                                    key={day.date}
                                    x={x}
                                    y={y}
                                    width="0.7"
                                    height="0.7"
                                    fill={getColor(day.level)}
                                    stroke="#30363d"
                                    strokeWidth="0.04"
                                    rx="0.2"
                                    onMouseEnter={() => setHoveredDay(day)}
                                    onMouseLeave={() => setHoveredDay(null)}
                                />
                            );
                        })}
                    </svg>
                </div>

                {/* Total Contributions and Hover Info */}
                <div className="w-full flex items-center justify-between text-left text-[0.5rem] text-white/30 mt-1">
                    <div>
                        {hoveredDay ? (
                            `${hoveredDay.count} contribution${hoveredDay.count !== 1 ? 's' : ''} on ${new Date(hoveredDay.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`
                        ) : (
                            `Total ${totalContributions} contributions in the last year`
                        )}
                    </div>
                    <div className='flex'>
                        <span>Less</span>
                        <span className="flex mx-1 items-center" style={{ gap: `${5 * 0.2}px` }}>
                            <div
                                className="rounded-sm"
                                style={{
                                    width: `${5}px`,
                                    height: `${5}px`,
                                    backgroundColor: '#222831'
                                }}
                            />
                            <div
                                className="rounded-sm"
                                style={{
                                    width: `${5}px`,
                                    height: `${5}px`,
                                    backgroundColor: '#0e4429'
                                }}
                            />
                            <div
                                className="rounded-sm"
                                style={{
                                    width: `${5}px`,
                                    height: `${5}px`,
                                    backgroundColor: '#006d32'
                                }}
                            />
                            <div
                                className="rounded-sm"
                                style={{
                                    width: `${5}px`,
                                    height: `${5}px`,
                                    backgroundColor: '#26a641'
                                }}
                            />
                            <div
                                className="rounded-sm"
                                style={{
                                    width: `${5}px`,
                                    height: `${5}px`,
                                    backgroundColor: '#39d353'
                                }}
                            />
                        </span>
                        <span>More</span>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <Card className="h-full w-full sm:max-h-[14.5rem] overflow-y-auto p-2 flex flex-col gap-2">
            {/* Contribution Graph */}
            <div ref={graphContainerRef} className='w-full'>
                {/* <p className="text-sm mb-2">Contribution Graph (Past Year)</p> */}
                {renderContributionGraph(data.contributionData)}
            </div>

            <div className="flex w-full h-full flex-col items-start gap-2">
                <div className='grid grid-cols-2 gap-4 w-full h-full'>
                    <div className='bg-gray-800 px-2 rounded-lg flex items-center gap-2'>
                        <img
                            src={data.avatarUrl}
                            alt="GitHub Profile Picture"
                            className="w-auto h-auto max-w-12 max-h-12 rounded-full border border-gray-500"
                        />
                        <div>
                            <h2 className="text-xs white">{data.name}</h2>
                            <p className="text-[0.6rem] text-white/30">@{process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'username'}</p>
                            <div className="text-[0.6rem] text-white/30 flex items-center gap-0.5 overflow-clip whitespace-nowrap">
                                <span>{data.followers} followers</span>
                                <span className="hidden mdk:inline-block">
                                    |
                                </span>
                                <div className='hidden md:flex'>
                                    <img
                                        src="/github/quickdraw.png"
                                        alt="quickdraw"
                                        className="w-auto h-auto max-w-2 max-h-2 rounded-full"
                                    />
                                    <img
                                        src="/github/YOLO.png"
                                        alt="yolo"
                                        className="w-auto h-auto max-w-2 max-h-2 rounded-full"
                                    />
                                    <img
                                        src="/github/PullShark.png"
                                        alt="pullshark"
                                        className="w-auto h-auto max-w-2 max-h-2 rounded-full"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className="rounded-lg bg-blue-500/20">
                            <p className="text-base font-semibold">{data.repositories}</p>
                            <p className="text-sm">Repos</p>
                        </div>
                        <div className="rounded-lg bg-amber-500/20">
                            <p className="text-base font-semibold">{data.starsEarned}</p>
                            <p className="text-sm">Stars</p>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-2 gap-4 w-full h-full'>
                    <div className="flex justify-center flex-col h-full w-full bg-pink-400/30 px-2 rounded-lg">
                        <p className="text-[0.6rem] text-white/30">Favorite Language</p>
                        <div className="flex items-center gap-2">
                            <p className="font-medium text-[0.7rem] text-white/60 rounded-sm" style={{ backgroundColor: data.mostUsedLanguage.color }}>
                                {data.mostUsedLanguage.name} ({data.mostUsedLanguage.percentage}%)
                            </p>
                        </div>
                    </div>

                    <div className="w-full flex items-center justify-start gap-4 h-full bg-cyan-500/20 rounded-lg">
                        <p className="text-lg font-semibold">{data.totalCommits}</p>
                        <p className="text-sm">Commits</p>
                    </div>
                </div>
            </div>

            {/* <div>
                <p className="text-sm mb-2">Achievement Badges</p>
                {data.achievementBadges.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {data.achievementBadges.map((badge) => (
                            <div
                                key={badge.name}
                                className="p-2 bg-blue-100 rounded-lg flex items-center gap-2"
                            >
                                <span className="text-sm font-medium">{badge.name}</span>
                                <span className="text-xs">{badge.description}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">No badges earned yet or data unavailable.</p>
                )}
            </div> */}
        </Card>
    );
};

export default GithubCard;