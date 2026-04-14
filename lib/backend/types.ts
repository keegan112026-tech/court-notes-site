export interface BackendComment {
    id: string;
    targetLineId: string;
    author: string;
    content: string;
    likes: number;
    status: string;
    createdAt: string;
    type: string;
    targetTopic?: string;
    targetSessionId?: string;
    reviewedAt?: string;
    reviewedBy?: string;
    reviewNote?: string;
}

export interface BackendInboxMessage {
    id: string;
    title: string;
    messageType: string;
    senderName: string;
    senderEmail?: string;
    content: string;
    attachmentUrl?: string;
    isSensitive: boolean;
    status: string;
    internalNote?: string;
    createdAt: string;
    handledBy?: string;
    handledAt?: string;
    relatedArticleId?: string;
    relatedSessionId?: string;
}

export interface BackendArticle {
    id: string;
    postId: string;
    author: string;
    contactEmail?: string;
    title: string;
    content: string;
    excerpt?: string;
    category: string;
    targetTopic: string;
    targetSessionId: string;
    primarySessionId?: string;
    sourceSessionIds?: string[];
    articleType?: string;
    publicSlug?: string;
    likes: number;
    status: string;
    createdAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
    reviewNote?: string;
}

export interface CreateArticleInput {
    author: string;
    contactEmail?: string;
    title: string;
    content: string;
    category: string;
    topic?: string;
    targetSessionSid?: string;
    sourceSessionSids?: string[];
}

export interface CreateCommentInput {
    targetLineId: string;
    author: string;
    content: string;
    sessionId?: string;
    topic?: string;
    type?: string;
}

export interface CreateContactInput {
    name: string;
    email?: string;
    category: string;
    content: string;
    attachmentUrl?: string;
}

export interface ReviewActionInput {
    targetId: string;
    reviewerName: string;
    note?: string;
    action: 'approve' | 'reject' | 'delete' | 'mark-read';
}

export interface InboxActionInput {
    targetId: string;
    reviewerName: string;
    note?: string;
    action: 'mark-read' | 'mark-resolved';
}

export interface BackendProvider {
    kind: 'firebase' | 'notion';
    fetchComments(_targetLineId: string): Promise<BackendComment[]>;
    createComment(_input: CreateCommentInput): Promise<void>;
    fetchAllComments(): Promise<BackendComment[]>;
    fetchAllForumPosts(): Promise<BackendArticle[]>;
    fetchForumPosts(): Promise<BackendArticle[]>;
    fetchForumPostById(_postId: string): Promise<BackendArticle | null>;
    fetchForumComments(_postId: string): Promise<BackendComment[]>;
    createForumPost(_input: CreateArticleInput): Promise<void>;
    fetchPendingForumPosts(): Promise<BackendArticle[]>;
    fetchPendingComments(): Promise<BackendComment[]>;
    reviewForumPost(_input: ReviewActionInput): Promise<void>;
    reviewComment(_input: ReviewActionInput): Promise<void>;
    fetchTrendingArticleComments(_limit?: number): Promise<BackendComment[]>;
    fetchTrendingArticles(_limit?: number): Promise<BackendArticle[]>;
    fetchInboxMessages(): Promise<BackendInboxMessage[]>;
    updateInboxMessage(_input: InboxActionInput): Promise<void>;
    createContact(_input: CreateContactInput): Promise<void>;
    incrementLike(_targetId: string, _targetType: 'transcripts' | 'interactions' | 'forum'): Promise<number>;
}
