export const ARTICLE_STATUS = {
  pending: '待審核',
  reviewing: '審閱中',
  revision: '退回修改',
  approved: '已核准',
  published: '已發布',
  archived: '已封存',
} as const;

export type ArticleStatusLabel = (typeof ARTICLE_STATUS)[keyof typeof ARTICLE_STATUS];

export function isPublishReadyStatus(status: string) {
  return status === ARTICLE_STATUS.approved;
}

export function isPublishedStatus(status: string) {
  return status === ARTICLE_STATUS.published;
}

export function isPublishableStatus(status: string) {
  return isPublishReadyStatus(status) || isPublishedStatus(status);
}

export function reviewActionToArticleStatus(action: 'approve' | 'reject' | 'delete' | 'mark-read') {
  if (action === 'approve') return ARTICLE_STATUS.approved;
  if (action === 'reject') return ARTICLE_STATUS.revision;
  if (action === 'mark-read') return ARTICLE_STATUS.reviewing;
  return ARTICLE_STATUS.archived;
}
