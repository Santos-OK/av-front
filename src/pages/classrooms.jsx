import React, { useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Chip,
    TextField,
    Button,
    InputAdornment,
    styled
} from '@mui/material';
import { Search, Clear, People, LocationOn } from '@mui/icons-material';
import { useClassroom } from "../context/ClassroomContext";
import ClassroomDetails from './ClassroomDetails';

// Tarjeta con altura fija
const ClassroomCard = styled(Card)(({ theme }) => ({
    height: '320px',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
    },
}));

// Imagen
const ClassroomImage = styled(CardMedia)(({ theme }) => ({
    height: '160px',
    width: '100%',
    objectFit: 'cover',
    flexShrink: 0,
}));

// Contenido
const ClassroomContent = styled(CardContent)(({ theme }) => ({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(1.5),
    overflow: 'hidden',
    '&:last-child': {
        paddingBottom: theme.spacing(1.5),
    },
}));

const AvailabilityChip = styled(Chip)(({ theme, available }) => ({
    backgroundColor: available ? '#238F74' : '#981D00',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.7rem',
    height: '24px',
}));

const SearchContainer = styled(Box)(({ theme }) => ({
    backgroundColor: 'white',
    padding: theme.spacing(3),
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    marginBottom: theme.spacing(3),
}));

const CategoryButton = styled(Button)(({ theme, selected }) => ({
    border: '2px solid',
    borderColor: selected ? '#238F74' : '#e0e0e0',
    backgroundColor: selected ? '#238F74' : 'transparent',
    color: selected ? 'white' : '#666666',
    fontWeight: selected ? 'bold' : 'normal',
    borderRadius: '20px',
    padding: '6px 16px',
    textTransform: 'none',
    transition: 'all 0.2s ease',
    '&:hover': {
        borderColor: '#238F74',
        backgroundColor: selected ? '#1A6B58' : 'rgba(35, 143, 116, 0.1)',
        color: selected ? 'white' : '#238F74',
    },
}));

const CategoryFilter = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: 1,
    flexWrap: 'wrap',
    marginTop: theme.spacing(2),
}));

const ActiveFilters = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: 1,
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: theme.spacing(2),
}));

export default function Classrooms() {
    const { state } = useClassroom();
    const [selectedClassroom, setSelectedClassroom] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);

    // Obtener categorías únicas de los salones
    const categories = [...new Set(state.classrooms.map(classroom => classroom.category))];

    // Filtrar salones basado en búsqueda y categorías seleccionadas
    const filteredClassrooms = state.classrooms.filter(classroom => {
        const matchesSearch = classroom.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            classroom.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            classroom.location.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategories.length === 0 ||
            selectedCategories.includes(classroom.category);

        return matchesSearch && matchesCategory;
    });

    const handleCardClick = (classroom) => {
        setSelectedClassroom(classroom);
        setDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setDetailsOpen(false);
        setSelectedClassroom(null);
    };

    const handleCategoryToggle = (category) => {
        setSelectedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleClearAll = () => {
        setSearchTerm('');
        setSelectedCategories([]);
    };

    const hasActiveFilters = searchTerm !== '' || selectedCategories.length > 0;

    // Estadísticas
    const totalClassrooms = state.classrooms.length;
    const availableClassrooms = state.classrooms.filter(c => c.available).length;
    const showingCount = filteredClassrooms.length;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom color="#238F74" fontWeight="bold">
                Salones Disponibles
            </Typography>

            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                Haz clic en cualquier salón para ver detalles y reservar
            </Typography>

            {/* Sección de Búsqueda y Filtros */}
            <SearchContainer>
                {/* Barra de búsqueda */}
                <TextField
                    placeholder="Buscar salón por nombre, descripción o ubicación..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search color="action" />
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <Clear
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => setSearchTerm('')}
                                    color="action"
                                />
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Filtros por categoría */}
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" fontWeight="medium" color="textSecondary" gutterBottom>
                        Tipo de Salón:
                    </Typography>
                    <CategoryFilter>
                        {categories.map(category => (
                            <CategoryButton
                                key={category}
                                selected={selectedCategories.includes(category)}
                                onClick={() => handleCategoryToggle(category)}
                                size="small"
                            >
                                {category}
                            </CategoryButton>
                        ))}
                    </CategoryFilter>
                </Box>

                {/* Filtros activos */}
                {hasActiveFilters && (
                    <ActiveFilters>
                        <Typography variant="body2" color="textSecondary">
                            Filtros activos:
                        </Typography>
                        {searchTerm && (
                            <Chip
                                label={`Busqueda: "${searchTerm}"`}
                                onDelete={() => setSearchTerm('')}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        )}
                        {selectedCategories.map(category => (
                            <Chip
                                key={category}
                                label={category}
                                onDelete={() => handleCategoryToggle(category)}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        ))}
                        <Button
                            startIcon={<Clear />}
                            onClick={handleClearAll}
                            size="small"
                            color="primary"
                            variant="text"
                        >
                            Limpiar todo
                        </Button>
                    </ActiveFilters>
                )}

                {/* Estadísticas */}
                <Box sx={{ display: 'flex', gap: 3, mt: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="textSecondary">
                        📊 Total: <strong>{totalClassrooms}</strong> salones
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        ✅ Disponibles: <strong>{availableClassrooms}</strong>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        👁️ Mostrando: <strong>{showingCount}</strong> salones
                    </Typography>
                </Box>
            </SearchContainer>

            {/* Resultados de la búsqueda */}
            {filteredClassrooms.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h5" color="textSecondary" gutterBottom>
                        🔍 No se encontraron salones
                    </Typography>
                    <Typography variant="body1" color="textSecondary" paragraph>
                        {hasActiveFilters
                            ? "Intenta ajustar tus filtros de búsqueda"
                            : "No hay salones disponibles en este momento"
                        }
                    </Typography>
                    {hasActiveFilters && (
                        <Button
                            variant="contained"
                            onClick={handleClearAll}
                            startIcon={<Clear />}
                            sx={{
                                backgroundColor: '#238F74',
                                '&:hover': { backgroundColor: '#1A6B58' }
                            }}
                        >
                            Limpiar todos los filtros
                        </Button>
                    )}
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {filteredClassrooms.map((classroom) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={classroom.id}>
                            <ClassroomCard onClick={() => handleCardClick(classroom)}>
                                <ClassroomImage
                                    component="img"
                                    image={classroom.image}
                                    alt={classroom.name}
                                />
                                <ClassroomContent>
                                    {/* Nombre del salón */}
                                    <Typography
                                        variant="body2"
                                        fontWeight="bold"
                                        sx={{
                                            lineHeight: 1.3,
                                            height: '2.6em',
                                            overflow: 'hidden',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            fontSize: '0.8rem',
                                            mb: 1
                                        }}
                                    >
                                        {classroom.name}
                                    </Typography>
                                    
                                    {/* Chip de categoría */}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                                        <Chip
                                            label={classroom.category}
                                            size="small"
                                            sx={{
                                                backgroundColor: '#238F74',
                                                color: 'white',
                                                fontSize: '0.65rem',
                                                height: '22px',
                                                width: 'auto',
                                                minWidth: 'auto',
                                                '& .MuiChip-label': {
                                                    px: 1,
                                                }
                                            }}
                                        />
                                    </Box>

                                    {/* Información de capacidad y ubicación */}
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <People sx={{ fontSize: '0.8rem', color: 'text.secondary' }} />
                                            <Typography variant="caption" color="textSecondary">
                                                Capacidad: <strong>{classroom.capacity} personas</strong>
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <LocationOn sx={{ fontSize: '0.8rem', color: 'text.secondary' }} />
                                            <Typography variant="caption" color="textSecondary">
                                                {classroom.location}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    
                                    {/* Disponibilidad */}
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mt: 'auto'
                                    }}>
                                        <AvailabilityChip
                                            available={classroom.available}
                                            label={classroom.available ? 'Disponible' : 'No disponible'}
                                            size="small"
                                        />
                                        <Typography
                                            variant="caption"
                                            color="textSecondary"
                                            sx={{ fontSize: '0.65rem' }}
                                        >
                                            Reservar
                                        </Typography>
                                    </Box>
                                </ClassroomContent>
                            </ClassroomCard>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Dialog de detalles */}
            <ClassroomDetails
                open={detailsOpen}
                onClose={handleCloseDetails}
                classroom={selectedClassroom}
            />
        </Box>
    );
}