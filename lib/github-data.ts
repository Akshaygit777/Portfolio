import { Octokit } from "@octokit/rest";


// GitHub API token from environment variable
const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;

// Your GitHub username (hardcoded for personal use, can be overridden by env)
const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "Akshaygit777";

// Validate token
if (!GITHUB_TOKEN) {
  console.error("GitHub token is not set in environment variables");
}

export interface MostUsedLanguage {
  name: string;
  color: string;
  percentage: number;
}

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface AchievementBadge {
  name: string;
  description: string;
  tier?: string;
}

export interface GitHubData {
  name: string;
  avatarUrl: string;
  totalCommits: string;
  mostUsedLanguage: MostUsedLanguage;
  repositories: string;
  starsEarned: string;
  followers: string;
  contributionData: ContributionDay[];
  achievementBadges: AchievementBadge[];
}

// Format numbers: <1k exact, >=1k as x.xk
function formatNumber(value: number): string {
  if (value < 1000) {
    return value.toString();
  }
  const thousands = value / 1000;
  return `${Math.round(thousands * 10) / 10}k`;
}

// Calculate contribution level for graph
function getContributionLevel(count: number): number {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

// Default language colors
function getLanguageColor(language: string): string {
  const colorMap: { [key: string]: string } = {
    JavaScript: "#f1e05a",
    TypeScript: "#2b7489",
    Python: "#3572A5",
    Java: "#b07219",
    C: "#555555",
    "C++": "#f34b7d",
    "C#": "#178600",
    Ruby: "#701516",
    PHP: "#4F5D95",
    Go: "#00ADD8",
    Rust: "#dea584",
    Swift: "#ffac45",
    Kotlin: "#F18E33",
    R: "#198CE7",
    Scala: "#c22d40",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Lua: "#000080",
    Haskell: "#5e5086",
  };
  return colorMap[language] || "#8b949e";
}

// Define types for GraphQL response structure
interface ContributionDayData {
  contributionCount: number;
  date: string;
}

interface WeekData {
  contributionDays: ContributionDayData[];
}

interface RepositoryNode {
  stargazerCount: number;
  primaryLanguage?: {
    name: string;
    color: string;
  };
}

// Define a specific type for the GraphQL response
interface GraphQLResponse {
  user: {
    contributionsCollection: {
      contributionCalendar: {
        totalContributions: number;
        weeks: WeekData[];
      };
    };
    repositories: {
      nodes: RepositoryNode[];
    };
  };
}

export async function fetchGitHubData(): Promise<GitHubData> {
  try {
    if (!GITHUB_TOKEN) {
      throw new Error("GitHub API token is missing. Please set NEXT_PUBLIC_GITHUB_TOKEN in .env.local");
    }

    if (!GITHUB_USERNAME) {
      throw new Error("GitHub username is missing. Please set NEXT_PUBLIC_GITHUB_USERNAME in .env.local or hardcode it");
    }

    const octokit = new Octokit({ auth: GITHUB_TOKEN });

    // Fetch user data
    const userResponse = await octokit.rest.users.getByUsername({
      username: GITHUB_USERNAME,
    });
    const userData = userResponse.data;

    // Fetch contribution and repository data via GraphQL
    const toDate = new Date();
    const fromDate = new Date(toDate.getFullYear() - 1, toDate.getMonth(), toDate.getDate());
    const graphqlQuery = `
      query($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
          repositories(first: 100, ownerAffiliations: OWNER) {
            nodes {
              stargazerCount
              primaryLanguage {
                name
                color
              }
            }
          }
        }
      }
    `;

    // Update the type assertion
    const graphqlResponse = await octokit.graphql(graphqlQuery, {
      username: GITHUB_USERNAME,
      from: fromDate.toISOString(),
      to: toDate.toISOString(),
    }) as GraphQLResponse;

    if (!graphqlResponse.user) {
      throw new Error(`User '${GITHUB_USERNAME}' not found or no data available`);
    }

    const user = graphqlResponse.user;
    const calendar = user.contributionsCollection.contributionCalendar;

    // Process contribution data
    const contributionDays: ContributionDay[] = calendar.weeks
      .flatMap((week: WeekData) =>
        week.contributionDays.map((day: ContributionDayData) => ({
          date: day.date,
          count: day.contributionCount,
          level: getContributionLevel(day.contributionCount),
        }))
      )
      .sort((a: ContributionDay, b: ContributionDay) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate most used language
    const languageCount: { [key: string]: number } = {};
    user.repositories.nodes.forEach((repo: RepositoryNode) => {
      if (repo.primaryLanguage?.name) {
        languageCount[repo.primaryLanguage.name] = (languageCount[repo.primaryLanguage.name] || 0) + 1;
      }
    });
    const mostUsedLanguageEntries = Object.entries(languageCount).sort((a, b) => b[1] - a[1]);
    const mostUsedLanguage: MostUsedLanguage = mostUsedLanguageEntries[0]
      ? {
          name: mostUsedLanguageEntries[0][0],
          color:
            user.repositories.nodes.find(
              (repo: RepositoryNode) => repo.primaryLanguage?.name === mostUsedLanguageEntries[0][0]
            )?.primaryLanguage?.color || getLanguageColor(mostUsedLanguageEntries[0][0]),
          percentage: Math.round((mostUsedLanguageEntries[0][1] / user.repositories.nodes.length) * 100) || 0,
        }
      : { name: "None", color: "#8b949e", percentage: 0 };

    // Calculate total stars
    const totalStars = user.repositories.nodes.reduce(
      (acc: number, repo: RepositoryNode) => acc + repo.stargazerCount,
      0
    );

    // Infer achievement badges (expanded conditions for testing)
    const achievementBadges: AchievementBadge[] = [];
    if (totalStars >= 16) {
      achievementBadges.push({
        name: "Starstruck",
        description: "Created a repository that has 16 stars or more",
      });
    }
    if (userData.public_repos > 0) {
      achievementBadges.push({
        name: "First Repo",
        description: "Created your first repository",
      });
    }
    if (calendar.totalContributions > 0) {
      achievementBadges.push({
        name: "First Commit",
        description: "Made your first commit",
      });
    }
    if (userData.followers > 0) {
      achievementBadges.push({
        name: "First Follower",
        description: "Gained your first follower",
      });
    }

    return {
      name: userData.name || GITHUB_USERNAME,
      avatarUrl: userData.avatar_url,
      totalCommits: formatNumber(calendar.totalContributions),
      mostUsedLanguage,
      repositories: formatNumber(userData.public_repos),
      starsEarned: formatNumber(totalStars),
      followers: formatNumber(userData.followers),
      contributionData: contributionDays,
      achievementBadges,
    };
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    throw error;
  }
}