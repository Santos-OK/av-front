import React, { useState, useEffect } from 'react';
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
import { Search, Clear } from '@mui/icons-material';
import { useEquipment } from "../context/EquipmentContext";
import EquipmentDetails from './EquipmentDetails';

// Tarjeta con altura fija
const EquipmentCard = styled(Card)(({ theme }) => ({
    height: '300px', // Altura fija para todas las cards
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    overflow: 'hidden', // Evita que el contenido se desborde
    '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: '0 12px 28px rgba(0,0,0,0.15)',
    },
}));

// Imagen centrada que mantiene proporción dentro del espacio fijo
const SquareCardMedia = styled(CardMedia)(({ theme }) => ({
    height: '160px', // Altura fija
    width: '100%', // Ocupa todo el ancho
    objectFit: 'cover', // Mantiene proporción
    flexShrink: 0,
    backgroundColor: '#f5f5f5', // Fondo para espacios sobrantes
}));

// Contenido que ocupa el espacio restante
const SquareCardContent = styled(CardContent)(({ theme }) => ({
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
    borderColor: selected ? '#D4AF37' : '#e0e0e0',
    backgroundColor: selected ? '#D4AF37' : 'transparent',
    color: selected ? 'white' : '#666666',
    fontWeight: selected ? 'bold' : 'normal',
    borderRadius: '20px',
    padding: '6px 16px',
    textTransform: 'none',
    transition: 'all 0.2s ease',
    '&:hover': {
        borderColor: '#D4AF37',
        backgroundColor: selected ? '#B8860B' : 'rgba(212, 175, 55, 0.1)',
        color: selected ? 'white' : '#D4AF37',
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

export default function Equipment() {
    const { state } = useEquipment();
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);

    // Obtener categorías únicas del equipo
    const categories = [...new Set(state.equipment.map(item => item.category))];

    // Filtrar equipo basado en búsqueda y categorías seleccionadas
    const filteredEquipment = state.equipment.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategories.length === 0 ||
            selectedCategories.includes(item.category);

        return matchesSearch && matchesCategory;
    });

    const handleCardClick = (equipment) => {
        setSelectedEquipment(equipment);
        setDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setDetailsOpen(false);
        setSelectedEquipment(null);
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
    const totalEquipment = state.equipment.length;
    const showingCount = filteredEquipment.length;

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom color="#8B0000" fontWeight="bold">
                Equipo Disponible
            </Typography>

            <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
                Haz clic en cualquier equipo para ver detalles y reservar
            </Typography>

            {/* Sección de Búsqueda y Filtros */}
            <SearchContainer>
                {/* Barra de búsqueda */}
                <TextField
                    placeholder="Buscar equipo por nombre o descripción..."
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
                        Categorías:
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
            </SearchContainer>

            {/* Resultados de la búsqueda */}
            {filteredEquipment.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h5" color="textSecondary" gutterBottom>
                        🔍 No se encontraron equipos
                    </Typography>
                    <Typography variant="body1" color="textSecondary" paragraph>
                        {hasActiveFilters
                            ? "Intenta ajustar tus filtros de búsqueda"
                            : "No hay equipos disponibles en este momento"
                        }
                    </Typography>
                    {hasActiveFilters && (
                        <Button
                            variant="contained"
                            onClick={handleClearAll}
                            startIcon={<Clear />}
                            sx={{
                                backgroundColor: '#D4AF37',
                                '&:hover': { backgroundColor: '#B8860B' }
                            }}
                        >
                            Limpiar todos los filtros
                        </Button>
                    )}
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {filteredEquipment.map((item) => (
                        <Grid item xs={6} sm={4} md={3} lg={2} key={item.id}>
                            <EquipmentCard onClick={() => handleCardClick(item)}>
                                <SquareCardMedia
                                    component="img"
                                    image={item.image}
                                    alt={item.name}
                                />
                                <SquareCardContent>
                                    {/* Nombre del equipo */}
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
                                        {item.name}
                                    </Typography>
                                    
                                    {/* Chip de categoría */}
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
                                        <Chip
                                            label={item.category}
                                            size="small"
                                            sx={{
                                                backgroundColor: '#D4AF37',
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
                                    
                                    {/* Disponibilidad y días */}
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mt: 'auto'
                                    }}>
                                        <AvailabilityChip
                                            available={item.quantity > 0}
                                            label={item.quantity > 0 ? `${item.quantity} disp.` : 'Agotado'}
                                            size="small"
                                        />
                                        <Typography
                                            variant="caption"
                                            color="textSecondary"
                                            sx={{ fontSize: '0.65rem' }}
                                        >
                                            {item.quantity === 1 ? '1 día' : '7 días'}
                                        </Typography>
                                    </Box>
                                </SquareCardContent>
                            </EquipmentCard>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Dialog de detalles */}
            <EquipmentDetails
                open={detailsOpen}
                onClose={handleCloseDetails}
                equipment={selectedEquipment}
            />
        </Box>
    );
}