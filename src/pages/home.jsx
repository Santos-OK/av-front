import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import { useNavigate } from "react-router";

// Colores
const tintoColor = '#8B0000';
const doradoColor = '#D4AF37';

// Styled components
const HeroSection = styled(Box)(({ theme }) => ({
  height: '30vh',
  backgroundColor: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottom: `4px solid ${doradoColor}`,
}));

const HeroTitle = styled(Typography)(({ theme }) => ({
  color: tintoColor,
  fontWeight: 'bold',
  fontSize: '4rem',
  textAlign: 'center',
  [theme.breakpoints.down('md')]: {
    fontSize: '3rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
  },
}));

const ImageCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  height: '100%',
  overflow: 'hidden',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
  },
}));

const CardButton = styled(Button)(({ theme }) => ({
  backgroundColor: doradoColor,
  color: '#FFF',
  fontWeight: 'bold',
  padding: theme.spacing(1.5, 3),
  borderRadius: '25px',
  position: 'absolute',
  bottom: 20,
  right: 20,
  minWidth: '120px',
  '&:hover': {
    backgroundColor: '#B8860B',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  transition: 'all 0.3s ease',
}));

const ContentSection = styled(Box)(({ theme }) => ({
  height: '70vh',
  padding: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
}));

function Home({ sortOrder, limit }) {

  const nav = useNavigate();

  // URLs de ejemplo para las imágenes - reemplaza con tus propias imágenes
  const equipmentImage = "https://images.unsplash.com/photo-1495707902641-75cac588d2e9?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  const classroomsImage = "https://images.unsplash.com/photo-1635424239131-32dc44986b56?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Sección Hero - 30% de la altura */}
      <HeroSection>
        <HeroTitle variant="h1">
          UP RESERVE
        </HeroTitle>
      </HeroSection>

      {/* Sección de contenido - 70% de la altura */}
      <ContentSection>
        <Grid
          container
          spacing={4}
          sx={{
            height: '100%',
            margin: 0,
            width: '100%',
            flexWrap: 'nowrap',
          }}
        >
          {/* Imagen de Equipment */}
          <Grid
            item
            xs={6}
            sx={{
              height: '100%',
              padding: '0 !important',
              display: 'flex',
            }}
          >
            <ImageCard>
              <CardMedia
                component="img"
                image={equipmentImage}
                alt="Equipo audiovisual"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.9)'
                }}
              />
              <CardContent sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                padding: 3
              }}>
                <CardButton
                  variant="contained"
                  onClick={() => nav("/equipment")}
                >
                  Equipo
                </CardButton>
              </CardContent>
            </ImageCard>
          </Grid>

          {/* Imagen de Classrooms */}
          <Grid
            item
            xs={6}
            sx={{
              height: '100%',
              padding: '0 !important',
              display: 'flex',
            }}
          >
            <ImageCard>
              <CardMedia
                component="img"
                image={classroomsImage}
                alt="Salones y aulas"
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(0.9)'
                }}
              />
              <CardContent sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                padding: 3
              }}>
                <CardButton
                  variant="contained"
                  onClick={() => nav("/classrooms")}
                >
                  Salones
                </CardButton>
              </CardContent>
            </ImageCard>
          </Grid>
        </Grid>
      </ContentSection>
    </Box>
  );
}

export default Home;