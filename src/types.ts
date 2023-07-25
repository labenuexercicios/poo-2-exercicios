export type TVideoDB = {
  id: string;
  titulo: string;
  segundos: number;
  created_at: string;
};

// tipagem para criação (POST)

export type TVideoDBPost = {
  id: string;
  titulo: string;
  segundos: number;
};
