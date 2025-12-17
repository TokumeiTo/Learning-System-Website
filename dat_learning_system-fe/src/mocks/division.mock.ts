import type { Division } from "../types/division";
import { Roles } from "../utils/constants";

export const divisionsMock: Division[] = [
    {
        id: 1,
        division_name: "System Development Division",
        division_head: {
            id: 1,
            companyCode: "00-00001",
            name: "Kalyar Soe",
            email: "ksexample@company.com",
            role: Roles.DIVISION_HEAD,
            division: "Technology Division",
        },

        departments: [
            {
                id: 1,
                department_name: "Application Development Dept",
                department_head: {
                    id: 2,
                    companyCode: "00-00002",
                    name: "Kay Khaing Zaw",
                    email: "kkzexample@company.com",
                    role: Roles.DEPARTMENT_HEAD,
                    division: "Technology Division",
                    department: "Development",
                },

                sections: [
                    {
                        id: 1,
                        section_name: "Section Alpha",
                        section_head: {
                            id: 3,
                            companyCode: "00-00003",
                            name: "Carol Section Head",
                            email: "carol@company.com",
                            role: Roles.SECTION_HEAD,
                            department: "Development",
                            section: "Section Alpha",
                        },

                        teams: [
                            {
                                id: 1,
                                team_name: "Team 1",
                                pm: {
                                    id: 10,
                                    companyCode: "00-00010",
                                    name: "PM Team 1",
                                    email: "pm1@company.com",
                                    role: Roles.PROJECT_MANAGER,
                                    team: "Team 1",
                                },
                            },
                            {
                                id: 2,
                                team_name: "Team 2",
                                pm: {
                                    id: 11,
                                    companyCode: "00-00011",
                                    name: "PM Team 2",
                                    email: "pm2@company.com",
                                    role: Roles.PROJECT_MANAGER,
                                    team: "Team 2",
                                },
                            },
                        ],
                    },

                    {
                        id: 2,
                        section_name: "Section Beta",
                        section_head: {
                            id: 4,
                            companyCode: "00-00004",
                            name: "David Section Head",
                            email: "david@company.com",
                            role: Roles.SECTION_HEAD,
                            department: "Development",
                            section: "Section Beta",
                        },

                        teams: [
                            {
                                id: 3,
                                team_name: "Team 3",
                                pm: {
                                    id: 12,
                                    companyCode: "00-00012",
                                    name: "PM Team 3",
                                    email: "pm3@company.com",
                                    role: Roles.PROJECT_MANAGER,
                                    team: "Team 3",
                                },
                            },
                            {
                                id: 4,
                                team_name: "Team 4",
                                pm: {
                                    id: 13,
                                    companyCode: "00-00013",
                                    name: "PM Team 4",
                                    email: "pm4@company.com",
                                    role: Roles.PROJECT_MANAGER,
                                    team: "Team 4",
                                },
                            },
                            {
                                id: 5,
                                team_name: "Team 5",
                                pm: {
                                    id: 14,
                                    companyCode: "00-00014",
                                    name: "PM Team 5",
                                    email: "pm5@company.com",
                                    role: Roles.PROJECT_MANAGER,
                                    team: "Team 5",
                                },
                            },
                        ],
                    },
                ],
            },

            {
                id: 2,
                department_name: "Offshore",
                department_head: {
                    id: 5,
                    companyCode: "00-00005",
                    name: "Eve Offshore Head",
                    email: "eve@company.com",
                    role: Roles.DEPARTMENT_HEAD,
                    department: "Offshore",
                },

                sections: [],
            },
        ],
    },
];
