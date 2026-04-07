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
import StyledBadge from "../common/Badge";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

interface UserProfileMenuProps {
    name: string;
    email: string;
    avatarUrl?: string;
    position: string;
    onLogout?: () => void;
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
    name,
    email,
    avatarUrl,
    position,
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
            sx={{ 
                padding: '5px', 
                maxWidth: '100%', // Ensure the stack doesn't exceed its container
                overflow: 'hidden' 
            }}
        >
            <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
            >
                <Avatar alt={name} src={avatarUrl} />
            </StyledBadge>

            {/* minWidth: 0 is the secret to making ellipsis work inside Flexbox */}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography 
                    variant="body2" 
                    fontSize={10} 
                    fontWeight={1000} 
                    color="success.main"
                    noWrap // MUI helper for ellipsis
                >
                    {position}
                </Typography>
                
                <Typography 
                    variant="body2" 
                    fontWeight={500} 
                    noWrap // Truncates name: "Thant Ht..."
                >
                    {name}
                </Typography>
                
                <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    noWrap // Truncates email
                    display="block" // Ensures it takes its own line properly
                >
                    {email}
                </Typography>
            </Box>

            {/* This keeps the More icon fixed at the end */}
            <Box>
                <Badge color="error" variant="dot" invisible>
                    <IconButton size="small" onClick={handleOpen}>
                        <MoreVertIcon />
                    </IconButton>
                </Badge>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuItem onClick={handleClose}>
                    <AccountCircleIcon fontSize="small" sx={{ mr: 1 }}/> Profile
                </MenuItem>
                <MenuItem onClick={handleClose}>
                    <SettingsIcon fontSize="small" sx={{ mr: 1 }}/> Settings
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleClose();
                        onLogout?.();
                    }}
                >
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
                </MenuItem>
            </Menu>
        </Stack>
    );
};
export default UserProfileMenu;