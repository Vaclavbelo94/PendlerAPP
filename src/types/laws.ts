
export interface Law {
  id: string;
  title: string;
  summary: string;
  category: string;
  lastUpdated: string;
  tags?: string[];
  importance: number;
  officialUrl?: string;
}
