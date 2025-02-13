import { Box, Container, Grid, Typography, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import structsLogo from 'assets/img/structs.png';
import janeStreetLogo from 'assets/img/sponsors/JaneStreetWhite.png';
import cseLogo from 'assets/img/affliations/CSE.png'
import arcLogo from 'assets/img/affliations/arc.png'
import acncLogo from 'assets/img/affliations/acnc.png'
import aristaLogo from 'assets/img/sponsors/arista.png'
import theTradeDeskLogo from 'assets/img/sponsors/theTradeDesk.png'
import scLogo from 'assets/img/sponsors/sc.png'
import imcLogo from 'assets/img/sponsors/imc.png'
import citadelLogo from 'assets/img/sponsors/citadel.png'

const StyledFooter = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  position: 'relative',
  paddingTop: 10,
  paddingBottom: 10,
}));

/**
 * The footer of the page
 */
const Footer = () => {
  return (
    <StyledFooter>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="center" paddingBottom={3}>
          <img height={35} src={structsLogo} alt="Structs.sh logo" />
          <Box display="inline-block" textAlign="left">
            <Typography display="inline" variant="h6" color="textPrimary">
              › Structs.sh
            </Typography>
          </Box>
        </Box>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography color="textPrimary" variant="h5">
              Information
            </Typography>
            <Typography color="textSecondary">
              <Link href="https://github.com/devsoc-unsw/structs.sh" color="inherit">
                GitHub Repository
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography color="textPrimary" variant="h5">
              Get Connected
            </Typography>
            <Typography color="textSecondary">
              <Link component={RouterLink} to="/feedback" color="inherit">
                Provide Feedback
              </Link>
            </Typography>
            <Typography color="textSecondary">
              <address>
                <Link href="mailto:projects@csesoc.org.au" color="inherit">
                  Email Us
                </Link>{' '}
              </address>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} textAlign="center">
            <Typography color="textPrimary" variant="h5">
              Social
            </Typography>
            <Typography color="textSecondary">
              <Link href="https://devsoc.app/" color="inherit">
                DevSoc Website
              </Link>
            </Typography>
            <Typography color="textSecondary">
              <Link href="https://www.facebook.com/devsocUNSW" color="inherit">
                Facebook
              </Link>
            </Typography>
          </Grid>
          {/* Grid item for affliations */}
          <Grid item xs={12} textAlign="center">
            <Typography color="textPrimary" variant="h5" style={{ marginBottom: '0.7rem' }}>
              Our Affliations
            </Typography>
            {/* Arc logo */}
            <Link href="https://www.arc.unsw.edu.au/" target="_blank" rel="noopener noreferrer">
              <img
                src={arcLogo}
                alt="Arc Logo"
                height={40}
                style={{ marginRight: '2vw', verticalAlign: 'middle' }}
              />
            </Link>
            {/* ACNC logo */}
            <Link href="https://www.acnc.gov.au/charity/charities/7fa763bf-0876-ee11-8179-00224893b0ed/profile" target="_blank" rel="noopener noreferrer">
              <img
                src={acncLogo}
                alt="ACNC Logo"
                height={40}
                style={{ marginRight: '2vw', verticalAlign: 'middle' }}
              />
            </Link>

            {/* CSE logo */}
            <Link href="https://www.unsw.edu.au/engineering/our-schools/computer-science-and-engineering" target="_blank" rel="noopener noreferrer">
              <img
                src={cseLogo}
                alt="CSE Logo"
                height={40}
                style={{ marginRight: '2vw', verticalAlign: 'middle' }}
              />
            </Link>

          </Grid>
          {/* New Grid item for Company Sponsors */}
          <Grid item xs={12} textAlign="center">
            <Typography color="textPrimary" variant="h5" style={{ marginBottom: '0.7rem' }}>
              Platinum Sponsors
            </Typography>
            {/* TTD logo */}
            <Link href="https://careers.thetradedesk.com/" target="_blank" rel="noopener noreferrer">
              <img
                src={theTradeDeskLogo}
                alt="The Trade Desk Logo"
                height={40}
                style={{ marginRight: '2vw', verticalAlign: 'middle' }}
              />
            </Link>

            {/* Arista Logo */}
            <Link href="https://www.arista.com/en/" target="_blank" rel="noopener noreferrer">
              <img
                src={aristaLogo}
                alt="Arista Logo"
                height={50}
                style={{ verticalAlign: 'middle', marginBottom: '0px' }}
              />
            </Link>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography color="textPrimary" variant="h5" style={{ marginBottom: '0.7rem' }}>
                Gold Sponsors
            </Typography>
            {/* SafetyCulture Logo */}
            <Link href="https://safetyculture.com/home/" target="_blank" rel="noopener noreferrer">
              <img
                src={scLogo}
                alt="SafetyCulture Logo"
                height={50}
                style={{ verticalAlign: 'middle', marginBottom: '0px' }}
              />
            </Link>
            {/* Jane Street Logo */}
            <Link href="https://www.janestreet.com/" target="_blank" rel="noopener noreferrer">
              <img
                src={janeStreetLogo}
                alt="Jane Street Logo"
                height={50}
                style={{ verticalAlign: 'middle', marginBottom: '0px' }}
              />
            </Link>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography color="textPrimary" variant="h5" style={{ marginBottom: '0.7rem' }}>
                Silver Sponsors
            </Typography>
            {/* IMC Logo */}
            <Link href="https://www.imc.com/ap" target="_blank" rel="noopener noreferrer">
              <img
                src={imcLogo}
                alt="IMC Logo"
                height={50}
                style={{ verticalAlign: 'middle', marginBottom: '0px' }}
              />
            </Link>
            {/* Citadel Logo */}
            <Link href="https://www.citadelsecurities.com/" target="_blank" rel="noopener noreferrer">
              <img
                src={citadelLogo}
                alt="Citadel Logo"
                height={50}
                style={{ verticalAlign: 'middle', marginBottom: '0px' }}
              />
            </Link>
          </Grid>
        </Grid>
      </Container>
      <Box textAlign="center" paddingTop={5}>
        <Typography color="textSecondary">
          © {new Date().getFullYear()} — Software Development Society (DevSoc)
        </Typography>
      </Box>
    </StyledFooter>
  );
};

export default Footer;
