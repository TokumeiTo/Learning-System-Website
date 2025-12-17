// mocks/orgMock.ts
export const orgMock = {
    divisions: [
        {
            name: "Technology Division",
            departments: [
                {
                    name: "Development",
                    sections: [
                        { name: "Section Alpha", teams: ["Team 1", "Team 2"] },
                        { name: "Section Beta", teams: ["Team 3"] },
                    ],
                },
                {
                    name: "Offshore",
                    sections: [
                        { name: "Section Gamma", teams: ["Team 4", "Team 5"] },
                    ],
                },
            ],
        },
        {
            name: "Operations Division",
            departments: [
                {
                    name: "HR",
                    sections: [
                        { name: "Section Delta", teams: ["Team 6"] },
                    ],
                },
            ],
        },
    ],
};
