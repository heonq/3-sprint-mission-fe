export interface GetArticleListParams {
  skip?: number;
  take?: number;
  orderBy?: 'recent' | 'likes';
  word?: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  isLiked: boolean;
  image: string;
  writer: ArticleWriter;
}

export interface GetArticleListResponse {
  totalCount: number;
  list: Article[];
}

export interface CreateArticleRequest {
  title: string;
  content: string;
}

export interface ArticleCommentRequest {
  content: string;
}

interface ArticleWriter {
  nickname: string;
  id: number;
}
