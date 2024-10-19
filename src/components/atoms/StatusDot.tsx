import { Box, Typography } from "@mui/material";

interface StatusDotProps {
    status: string;
}

const StatusDot: React.FC<StatusDotProps> = ({ status }) => {
    // Function to determine the color of the dot based on the tournament status
    const getStatusColor = (status: string) => {
        switch (status) {
            case "ONGOING":
                return "green";
            case "COMPLETED":
                return "red";
            case "UPCOMING":
                return "yellow";
            default:
                return "gray"; // Default color if status is unknown
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                top: 8,
                right: 13
            }}
        >
            {/* Status Text */}
            <Typography variant="caption" color="textSecondary">
                {status}
            </Typography>
            {/* Status Dot */}
            <Box
                sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    backgroundColor: getStatusColor(status),
                    marginLeft: 1
                }}
            />
        </Box>
    );
};

export default StatusDot;
