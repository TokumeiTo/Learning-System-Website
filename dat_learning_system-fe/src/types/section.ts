import type { Team } from "./team";
import type { User } from "./user";

export interface Section {
    id: number;
    section_name: string;
    section_head: User;
    teams: Team[];
}
