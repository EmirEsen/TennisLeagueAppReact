import { Container, Grid } from '@mui/material'
import { IPlayerProfile } from '../models/IPlayerProfile'
import EditPlayerProfile from '../components/molecules/EditPlayerProfile'

function Profile(props: { profile: IPlayerProfile }) {
    return (
        <>            
            <Container maxWidth="lg" style={{ marginTop: '20px' }}>
                <Grid container spacing={2} justifyContent={'center'}>
                    <EditPlayerProfile playerProfile={props.profile} />
                </Grid>
            </Container>
        </>
    )
}

export default Profile
