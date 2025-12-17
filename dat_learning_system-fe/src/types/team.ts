import type { User } from "./user";

export interface Team {
    id: number;
    team_name: string;
    pm: User;
}
