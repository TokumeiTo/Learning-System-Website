import * as React from "react";
import {
    Avatar,
    Box,
    Stack,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Badge,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import StyledBadge from "./common/Badge";

interface UserProfileMenuProps {
    name: string;
    email: string;
    avatarUrl?: string;
    onLogout?: () => void;
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
    name,
    email,
    avatarUrl,
    onLogout,
}) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ padding: '5px' }}
        >
            <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
            >
                <Avatar alt={name} src={avatarUrl} />
            </StyledBadge>

            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" fontSize={10} fontWeight={1000} color="success">
                    Employee
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                    {name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    {email}
                </Typography>
            </Box>

            <Badge color="error" variant="dot" invisible>
                <IconButton size="small" onClick={handleOpen}>
                    <MoreVertIcon />
                </IconButton>
            </Badge>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>Settings</MenuItem>
                <MenuItem
                    onClick={() => {
                        handleClose();
                        onLogout?.();
                    }}
                >
                    Logout
                </MenuItem>
            </Menu>
        </Stack>
    );
};

export default UserProfileMenu;
