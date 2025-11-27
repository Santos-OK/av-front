import React, { useState, useEffect } from 'react';
import {
    Box,
    Dialog,
    DialogContent,
    CardMedia,
    Typography,
    Button,
    Chip,
    Divider,
    IconButton,
    Grid,
    Alert,
    TextField,
    styled
} from '@mui/material';
import { Close, AddShoppingCart, Add, Remove, CalendarToday } from '@mui/icons-material';
import { useEquipment } from "../context/EquipmentContext";

// Función para convertir Date a string YYYY-MM-DD
const dateToInputString = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Función para convertir string YYYY-MM-DD a Date
const inputStringToDate = (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

const DoradoButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#D4AF37',
    color: '#FFF',
    fontWeight: 'bold',
    padding: theme.spacing(1.5, 3),
    '&:hover': {
        backgroundColor: '#B8860B',
    },
}));

const DetailsContainer = styled(Box)(({ theme }) => ({
    position: 'relative',
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    '&:hover': {
        backgroundColor: 'rgba(255,255,255,1)',
    },
}));

const QuantitySelector = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    padding: theme.spacing(0.5),
    width: 'fit-content',
}));

const QuantityButton = styled(IconButton)(({ theme }) => ({
    backgroundColor: '#f5f5f5',
    '&:hover': {
        backgroundColor: '#e0e0e0',
    },
    '&:disabled': {
        backgroundColor: '#fafafa',
        color: '#bdbdbd',
    },
}));

const SummaryBox = styled(Box)(({ theme }) => ({
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    padding: theme.spacing(2),
    border: `2px solid #D4AF37`,
}));

const CalendarContainer = styled(Box)(({ theme }) => ({
    border: '2px solid #e0e0e0',
    borderRadius: '12px',
    padding: theme.spacing(2),
    backgroundColor: '#fafafa',
}));

// Función simple para formatear fechas
const formatDate = (date) => {
    if (!date) return '--';
    return date.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Función para agregar días a una fecha
const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export default function EquipmentDetails({ open, onClose, equipment }) {
    const { actions } = useEquipment();
    const [addedToCart, setAddedToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [startDate, setStartDate] = useState(null);

    // Reset cuando se abre un equipo diferente
    useEffect(() => {
        setQuantity(1);
        setAddedToCart(false);
        setStartDate(new Date()); // Fecha actual por defecto
    }, [equipment]);

    if (!equipment) return null;

    const handleAddToCart = () => {
        console.log('Añadiendo equipo al carrito:', equipment.id, quantity, startDate);

        // Calcular fecha de retorno basada en los días de préstamo
        const calculatedReturnDate = returnDate;

        // Asegurarnos de que la función addToCart existe
        if (actions.addToCart) {
            actions.addToCart(equipment.id, quantity, startDate, calculatedReturnDate);
            setAddedToCart(true);
            setTimeout(() => {
                setAddedToCart(false);
                setQuantity(1);
                onClose();
            }, 2000);
        } else {
            console.error('addToCart no está definido en EquipmentContext');
            alert('Error: No se pudo añadir al carrito. La función no está disponible.');
        }
    };

    const getRentalDays = () => {
        return equipment.quantity === 1 ? 1 : 7;
    };

    const handleIncrease = () => {
        if (quantity < equipment.quantity-1) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const maxQuantityReached = quantity >= equipment.quantity;
    const rentalDays = getRentalDays();

    // Calcular fecha de retorno
    const returnDate = startDate ? addDays(startDate, rentalDays) : null;

    const handleDateChange = (event) => {
        const newDate = inputStringToDate(event.target.value);
        setStartDate(newDate);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    overflow: 'hidden',
                    maxHeight: '90vh'
                }
            }}
        >
            <DetailsContainer>
                <CloseButton onClick={onClose}>
                    <Close />
                </CloseButton>

                <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
                    <Box sx={{ p: 3, maxHeight: '70vh', overflow: 'auto' }}>
                        <Grid container spacing={4}>
                            {/* Columna de imagen */}
                            <Grid item xs={12} md={6}>
                                <CardMedia
                                    component="img"
                                    image={equipment.image}
                                    alt={equipment.name}
                                    sx={{
                                        width: '200px',
                                        height: 300,
                                        objectFit: 'cover',
                                        borderRadius: 2,
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                    }}
                                />
                            </Grid>

                            {/* Columna de información */}
                            <Grid item xs={12} md={6}>
                                <Box sx={{ mb: 3 }}>
                                    <Chip
                                        label={equipment.category}
                                        sx={{
                                            backgroundColor: '#D4AF37',
                                            color: 'white',
                                            mb: 2,
                                            fontSize: '0.9rem',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                    <Typography variant="h4" fontWeight="bold" gutterBottom color="#8B0000">
                                        {equipment.name}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" paragraph sx={{ lineHeight: 1.6 }}>
                                        {equipment.description}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                {/* Información de disponibilidad */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        📦 Disponibilidad
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                        <Typography
                                            variant="h5"
                                            fontWeight="bold"
                                            color={equipment.quantity > 0 ? 'success.main' : 'error.main'}
                                        >
                                            {equipment.quantity > 0 ? `${equipment.quantity} disponibles` : 'Agotado'}
                                        </Typography>
                                        <Chip
                                            label={rentalDays === 1 ? "1 día" : "7 días"}
                                            color={rentalDays === 1 ? "warning" : "success"}
                                            variant="outlined"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </Box>

                                    {equipment.quantity === 1 && (
                                        <Alert severity="warning" sx={{ mb: 2 }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                ⚠️ Última unidad disponible - Préstamo por 1 día solamente
                                            </Typography>
                                        </Alert>
                                    )}
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                {/* Selector de cantidad */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        🔢 Cantidad a Reservar
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                                        <QuantitySelector>
                                            <QuantityButton
                                                onClick={handleDecrease}
                                                disabled={quantity <= 1 || equipment.quantity === 0}
                                                size="small"
                                            >
                                                <Remove />
                                            </QuantityButton>
                                            <Typography
                                                variant="h5"
                                                sx={{
                                                    minWidth: '50px',
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    color: equipment.quantity === 0 ? 'text.disabled' : '#8B0000'
                                                }}
                                            >
                                                {quantity}
                                            </Typography>
                                            <QuantityButton
                                                onClick={handleIncrease}
                                                disabled={maxQuantityReached || equipment.quantity === 0}
                                                size="small"
                                            >
                                                <Add />
                                            </QuantityButton>
                                        </QuantitySelector>

                                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.9rem' }}>
                                            de <strong>{equipment.quantity}</strong> disponible{equipment.quantity !== 1 ? 's' : ''}
                                        </Typography>
                                    </Box>

                                    {equipment.quantity === 0 ? (
                                        <Alert severity="error" sx={{ mt: 1 }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                ❌ No hay unidades disponibles
                                            </Typography>
                                        </Alert>
                                    ) : (
                                        maxQuantityReached && (
                                            <Alert severity="info" sx={{ mt: 1 }}>
                                                <Typography variant="body2">
                                                    ✅ Has seleccionado todas las unidades disponibles
                                                </Typography>
                                            </Alert>
                                        )
                                    )}
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                {/* Selector de fecha simple */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        📅 Fecha de Inicio de Reserva
                                    </Typography>
                                    <CalendarContainer>
                                        <TextField
                                            label="Fecha de inicio"
                                            type="date"
                                            value={dateToInputString(startDate)}
                                            onChange={handleDateChange}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            fullWidth
                                            InputProps={{
                                                startAdornment: (
                                                    <CalendarToday sx={{ color: '#D4AF37', mr: 1 }} />
                                                ),
                                            }}
                                        />

                                        {startDate && (
                                            <Box sx={{ mt: 2, p: 2, backgroundColor: 'white', borderRadius: 1 }}>
                                                <Typography variant="body2" fontWeight="bold" color="#8B0000">
                                                    📅 Fechas de tu reserva:
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                                    <Typography variant="body2">
                                                        Inicio:
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="bold">
                                                        {formatDate(startDate)}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                                    <Typography variant="body2">
                                                        Retorno:
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="bold" color="success.main">
                                                        {returnDate ? formatDate(returnDate) : '--'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}

                                        <Alert severity="info" sx={{ mt: 2 }}>
                                            <Typography variant="body2">
                                                📌 <strong>Nota:</strong> El equipo debe ser recogido en la fecha de inicio seleccionada
                                            </Typography>
                                        </Alert>
                                    </CalendarContainer>
                                </Box>

                                <Divider sx={{ my: 3 }} />

                                {/* Resumen de la reserva */}
                                <SummaryBox sx={{ mb: 3 }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom color="#8B0000">
                                        📋 Resumen de tu Reserva
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography variant="body2" fontWeight="medium">Cantidad:</Typography>
                                        <Typography variant="body2" fontWeight="bold" color="#8B0000">
                                            {quantity} unidad{quantity !== 1 ? 'es' : ''}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography variant="body2" fontWeight="medium">Días de préstamo:</Typography>
                                        <Typography variant="body2" fontWeight="bold" color="#8B0000">
                                            {rentalDays} día{rentalDays !== 1 ? 's' : ''}
                                        </Typography>
                                    </Box>
                                    {startDate && (
                                        <>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                                <Typography variant="body2" fontWeight="medium">Fecha de inicio:</Typography>
                                                <Typography variant="body2" fontWeight="bold" color="#8B0000">
                                                    {startDate.toLocaleDateString('es-ES')}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                                <Typography variant="body2" fontWeight="medium">Fecha de retorno:</Typography>
                                                <Typography variant="body2" fontWeight="bold" color="success.main">
                                                    {returnDate ? returnDate.toLocaleDateString('es-ES') : '--'}
                                                </Typography>
                                            </Box>
                                        </>
                                    )}
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography variant="body2" fontWeight="medium">Disponibilidad después:</Typography>
                                        <Typography variant="body2" fontWeight="bold" color={equipment.quantity - quantity > 0 ? 'success.main' : 'warning.main'}>
                                            {equipment.quantity - quantity} disponible{equipment.quantity - quantity !== 1 ? 's' : ''}
                                        </Typography>
                                    </Box>
                                    <Divider sx={{ my: 1.5 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="body2" fontWeight="medium">Estado:</Typography>
                                        <Chip
                                            label={startDate ? "Listo para reservar" : "Selecciona fecha"}
                                            color={startDate ? "primary" : "default"}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </Box>
                                </SummaryBox>

                                {/* Política de préstamo */}
                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                                        📝 Política de Préstamo
                                    </Typography>
                                    <Box sx={{ pl: 1 }}>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                            • 🎓 Servicio exclusivo para estudiantes universitarios
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                            • 📅 Equipo con múltiples unidades: <strong>7 días</strong> de préstamo
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                            • ⏰ Última unidad disponible: <strong>1 día</strong> de préstamo
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                            • 📆 Los días de préstamo se calculan a partir de la fecha de inicio seleccionada
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            • 🆔 Presentar credencial al recoger el equipo
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Botón fijo en la parte inferior */}
                    <Box sx={{
                        p: 3,
                        borderTop: '1px solid #e0e0e0',
                        backgroundColor: 'white',
                        position: 'sticky',
                        bottom: 0
                    }}>
                        <DoradoButton
                            variant="contained"
                            fullWidth
                            size="large"
                            startIcon={<AddShoppingCart />}
                            onClick={handleAddToCart}
                            disabled={equipment.quantity === 0 || addedToCart || !startDate}
                            sx={{
                                py: 1.5,
                                fontSize: '1.1rem'
                            }}
                        >
                            {addedToCart ? '✓ Añadido al Carrito' : `Añadir ${quantity} al Carrito`}
                        </DoradoButton>

                        {!startDate && (
                            <Alert severity="warning" sx={{ mt: 2 }}>
                                <Typography variant="body2">
                                    ⚠️ Por favor selecciona una fecha de inicio para la reserva
                                </Typography>
                            </Alert>
                        )}

                        {addedToCart && (
                            <Alert severity="success" sx={{ mt: 2 }}>
                                <Typography variant="body2" fontWeight="bold">
                                    {quantity} unidad{quantity !== 1 ? 'es' : ''} añadida{quantity !== 1 ? 's' : ''} al carrito.
                                    Redirigiendo...
                                </Typography>
                            </Alert>
                        )}

                        {equipment.quantity === 0 && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                <Typography variant="body2" fontWeight="bold">
                                    ❌ Este equipo no está disponible actualmente
                                </Typography>
                            </Alert>
                        )}
                    </Box>
                </DialogContent>
            </DetailsContainer>
        </Dialog>
    );
}