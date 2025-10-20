import api from "../utils/baseUrl";

export type PublicCategory = {
  _id: string;
  name: string;
  slug: string;
  parent: string | null;
  children?: PublicCategory[];
};

export const fetchPublicCategories = async (): Promise<PublicCategory[]> => {
  const { data } = await api.get<{ tree: PublicCategory[] }>("/api/user/category");
  return data.tree ?? [];
};
