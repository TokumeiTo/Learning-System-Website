import { ListItemButton, ListItemText } from "@mui/material";

type Props = {
    title: string;
    active: boolean;
    description?: string; // <-- description from admin
    isTest?: boolean;     // <-- true if plate is a test
    correct?: number;
    wrong?: number;
    onClick: (info: {
        title: string;
        description?: string;
        isTest?: boolean;
        correct?: number;
        wrong?: number;
    }) => void;
};


export default function PlateItem({ title, active, description, isTest, correct, wrong, onClick }: Props) {
    const handleClick = () => {
        onClick({ title, description, isTest, correct, wrong });
    };

    return (
        <ListItemButton
            sx={{
                pl: 2,
                borderRadius: 1,
                bgcolor: active ? "rgba(76, 175, 80, 0.15)" : "transparent",
                boxShadow: active ? "0 0 8px rgba(76, 175, 80, 0.6)" : "none",
                transition: "all 0.2s ease",
            }}
            onClick={handleClick}
        >
            <ListItemText primary={title} />
        </ListItemButton>
    );
}
