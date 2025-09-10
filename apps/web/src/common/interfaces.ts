export interface Tags{
    name: string
    fancyName: string
    icon: string
    posts: Post[]
}
export interface Post {
  timestamp: string;
  content: string;
  tags: Tags[];
}