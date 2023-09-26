import { Container, Grid } from '@mui/material'

const Footer = () => {
  return (
    <Grid>
      <Container maxWidth='xl' className='footer'>
        <Grid>&copy; {new Date().getFullYear()} Netro</Grid>
      </Container>
    </Grid>
  )
}

export default Footer
