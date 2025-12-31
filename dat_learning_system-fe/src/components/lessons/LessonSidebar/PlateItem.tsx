import { ListItemButton, ListItemText } from "@mui/material";

type Props = {
    title: string;
    active: boolean;
    onClick: () => void;
};

export default function PlateItem({ title, active, onClick }: Props) {
    return (
        <ListItemButton
            sx={{
                pl: 2,
                borderRadius: 1,
                bgcolor: active ? "rgba(76, 175, 80, 0.15)" : "transparent",
                boxShadow: active ? "0 0 8px rgba(76, 175, 80, 0.6)" : "none",
                transition: "all 0.2s ease",
            }}
            onClick={onClick}
        >
            <ListItemText primary={title} />
        </ListItemButton>
    );
}
