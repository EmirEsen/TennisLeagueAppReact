import { Badge, Box, Card, CardMedia, Chip, Grid, Typography } from "@mui/material";
import { ArrowDropDownOutlined, EmojiEventsOutlined, SportsTennis, StarRateOutlined } from "@mui/icons-material";
import { IPlayerProfile } from "../../models/IPlayerProfile";

const badgeColors: Record<number, string> = {
    1: 'gold',     // First position color
    2: 'silver',   // Second position color
    3: '#cd7f32'  // Third position color
};

export default function PlayerCard(props: { player: IPlayerProfile }) {

    const badgeColor = badgeColors[1] || 'grey';
    return (
        <Card sx={{ width: '100%', marginTop: 2, maxWidth: 950, borderRadius: '16px' }} elevation={2}>
            <Grid container direction="row" justifyContent="center" alignItems="center" >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'center' }}>
                    <Badge
                        badgeContent={`#${1}`}
                        color="default"
                        overlap="circular"
                        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                        sx={{
                            '.MuiBadge-badge': {
                                width: 30,
                                height: 30,
                                borderRadius: '50%',
                                backgroundColor: badgeColor,
                                color: '#fff',
                                fontSize: '1rem'
                            }
                        }}
                    >
                        <CardMedia component="img" image={props.player.profileImageUrl} sx={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', objectPosition: 'top 2', border: '1px solid', marginTop: '5px' }} alt={props.player.lastname} />
                    </Badge>
                    <Typography variant="h5">{props.player.firstname} {props.player.lastname}</Typography>
                    <Chip variant="outlined" color="warning" icon={<StarRateOutlined />} label={`Rating ${props.player.rating}`} />
                    <Box sx={{
                        display: 'flex', justifyContent: 'space-around', alignItems: 'center', my: 1
                    }}>
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                            mb: 1,
                            gap: 0.5,
                        }}>
                            <Chip icon={<SportsTennis />} color="primary" label={`Played ${props.player.matchPlayed}`} variant="outlined" />
                            <Chip icon={<EmojiEventsOutlined />} color="success" label={`Won ${props.player.win}`} variant="outlined" />
                            <Chip icon={<ArrowDropDownOutlined />} color="error" label={`Lost ${props.player.lose}`} variant="outlined" />
                        </Box>
                        {/* <Typography variant="body1" color="text.secondary">{props.player.age}</Typography>
                            <Typography variant="body1" sx={{ mx: 1 }}>|</Typography>
                            <Typography variant="body1" color="text.secondary">{props.player.height.toFixed(2)} cm</Typography>
                            <Typography variant="body1" sx={{ mx: 1 }}>|</Typography>
                            <Typography variant="body1" color="text.secondary">{props.player.weight} kg</Typography> */}
                    </Box>
                </Box>
            </Grid>
        </Card >
    )


}


