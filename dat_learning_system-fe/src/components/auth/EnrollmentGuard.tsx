import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { getEnrollmentStatus } from '../../api/enrollment.api';
import { CircularProgress, Box } from '@mui/material';
import { useAuth } from '../../hooks/useAuth'; // Import your auth hook

const EnrollmentGuard = ({ children }: { children: React.ReactNode }) => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [isAllowed, setIsAllowed] = useState<boolean | null>(null);

    useEffect(() => {
        const verifyAccess = async () => {
            // 1. Check if user is Admin/SuperAdmin - Immediate bypass
            if (user?.position === 'Admin' || user?.position === 'SuperAdmin') {
                setIsAllowed(true);
                return;
            }

            // 2. If not Admin, check enrollment status via API
            try {
                const res = await getEnrollmentStatus(id!);
                if (res.isEnrolled) {
                    setIsAllowed(true);
                } else {
                    setIsAllowed(false);
                }
            } catch (err) {
                console.error("Enrollment check failed:", err);
                setIsAllowed(false);
            }
        };

        if (id && user) {
            verifyAccess();
        }
    }, [id, user]);

    // Loading State
    if (isAllowed === null) return (
        <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: '#0f172a' }}>
            <CircularProgress />
        </Box>
    );

    // 3. Navigate to /unauthorized if access is denied
    return isAllowed ? <>{children}</> : <Navigate to="/unauthorized" replace />;
};

export default EnrollmentGuard;