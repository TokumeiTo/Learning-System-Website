export type stepPlate = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  locked: boolean;

  isTest?: boolean;
  correct?: number;
  wrong?: number;
};
