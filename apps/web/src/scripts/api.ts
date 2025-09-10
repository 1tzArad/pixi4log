import axios, { type AxiosInstance } from "axios";
import type { Post, Tags } from "../common/interfaces";

export class API {
  private baseUrl: string = import.meta.env.API_URL as string;
  private ax: AxiosInstance;
  public constructor() {
    this.ax = axios.create({
      baseURL: this.baseUrl,
    });
  }
  public async getTags(): Promise<Tags[]> {
    const res = await this.ax.get("/tags");
    const json = res.data;
    return json.data;
  }
  public async getPosts(): Promise<Post[]>{
    return (await this.ax.get('/posts')).data.data;
  }
  public async getPostsByTag(tagname: string): Promise<Post[]>{
    return (await this.ax.get('/tags/' + tagname)).data.data.posts
  }
  public async getTagByName(tagname: string): Promise<Tags>{
    return (await this.ax.get('/tags/' + tagname)).data.data;
  }
  public async getPostByTimestamp(timestamp: string): Promise<Post>{
    return (await this.ax.get('/posts/' + timestamp)).data.data
  }
}
