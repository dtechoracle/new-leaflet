import { Octokit } from "octokit";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  html_url: string;
  owner: {
    login: string;
  };
}

export function createGitHubClient(accessToken: string) {
  return new Octokit({
    auth: accessToken,
  });
}

export async function getUserRepositories(accessToken: string): Promise<GitHubRepo[]> {
  const octokit = createGitHubClient(accessToken);
  
  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    sort: "updated",
    per_page: 100,
  });

  return data.map((repo) => ({
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    description: repo.description,
    language: repo.language,
    stargazers_count: repo.stargazers_count,
    html_url: repo.html_url,
    owner: {
      login: repo.owner.login,
    },
  }));
}

export async function getRepositoryContent(
  accessToken: string,
  owner: string,
  repo: string,
  path: string = ""
): Promise<any> {
  const octokit = createGitHubClient(accessToken);
  
  try {
    const { data } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });
    return data;
  } catch (error) {
    console.error(`Error fetching content for ${owner}/${repo}/${path}:`, error);
    throw error;
  }
}

