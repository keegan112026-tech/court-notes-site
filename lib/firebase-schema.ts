export const FIRESTORE_COLLECTIONS = {
    cms: 'cms',
    articles: 'articles',
    comments: 'comments',
    contacts: 'contacts',
} as const;

export const ARTICLE_STATUS = {
    pending: 'pending',
    approved: 'approved',
    rejected: 'rejected',
} as const;

export const COMMENT_TYPES = {
    paragraph: '段落留言',
    article: '文章留言',
} as const;

export const CONTACT_STATUS = {
    pending: 'pending',
    reviewed: 'reviewed',
    archived: 'archived',
} as const;

export type FirestoreArticleStatus = typeof ARTICLE_STATUS[keyof typeof ARTICLE_STATUS];
export type FirestoreCommentType = typeof COMMENT_TYPES[keyof typeof COMMENT_TYPES];
export type FirestoreContactStatus = typeof CONTACT_STATUS[keyof typeof CONTACT_STATUS];

export interface FirestoreCmsDoc {
    key: string;
    content: string;
    updatedAt: string;
}

export interface FirestoreArticleDoc {
    postId: string;
    author: string;
    title: string;
    content: string;
    category: string;
    targetTopic: string;
    targetSessionId: string;
    likes: number;
    status: FirestoreArticleStatus;
    source: 'workspace';
    createdAt: string;
}

export interface FirestoreCommentDoc {
    targetLineId: string;
    author: string;
    content: string;
    likes: number;
    status: FirestoreArticleStatus;
    type: FirestoreCommentType;
    targetTopic: string;
    targetSessionId: string;
    createdAt: string;
}

export interface FirestoreContactDoc {
    name: string;
    category: string;
    content: string;
    attachmentUrl: string;
    status: FirestoreContactStatus;
    createdAt: string;
}
