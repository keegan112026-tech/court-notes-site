export type PublishedArticleType =
  | 'single-session'
  | 'multi-session'
  | 'thematic';

export interface PublishedArticleLinkageSummary {
  sessionCount: number;
  witnessCount: number;
  topicCount: number;
}

export interface PublishedArticleIndexItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  articleType: PublishedArticleType;
  primarySessionId?: string;
  sourceSessionIds: string[];
  sourceTopicKeys?: string[];
  sourceWitnessLabels?: string[];
  publishedAt: string;
  authorLabel: string;
  linkageSummary?: PublishedArticleLinkageSummary;
}

export interface PublishedArticleSnapshot extends PublishedArticleIndexItem {
  contentHtml: string;
  reviewedAt?: string;
  reviewedBy?: string;
  publishedVersion: number;
  commentsOpen: boolean;
  likesSnapshot: number;
}

export interface PublishedArticlesIndex {
  generatedAt: string | null;
  items: PublishedArticleIndexItem[];
}
