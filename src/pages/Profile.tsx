import { Container, Grid } from '@mui/material'
import PlayerCard from '../components/molecules/PlayerCard'
import NavBar from '../components/organisms/NavBar'
import { IPlayerProfile } from '../models/IPlayerProfile'
import EditPlayerProfile from '../components/molecules/EditPlayerProfile'
import { Toaster } from 'react-hot-toast'


function Profile(props: { profile: IPlayerProfile }) {
    return (
        <>
            <Toaster />
            <NavBar />
            <Container maxWidth="lg" style={{ marginTop: '20px' }}>
                <Grid container spacing={2} justifyContent={'center'}>

                    <PlayerCard player={props.profile} />

                    <EditPlayerProfile playerProfile={props.profile} />

                </Grid>
            </Container>
        </>
    )
}

export default Profile
