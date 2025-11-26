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
import { useClassroom } from "../context/ClassroomContext";

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

export default function ClassroomDetails({ open, onClose, classroom }) {
    const { actions } = useClassroom();
    const [addedToCart, setAddedToCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [startDate, setStartDate] = useState(null);

    // Reset cuando se abre un salón diferente
    useEffect(() => {
        setQuantity(1);
        setAddedToCart(false);
        setStartDate(new Date()); // Fecha actual por defecto
    }, [classroom]);

    if (!classroom) return null;

    const handleAddToCart = () => {
        console.log('Añadiendo al carrito:', classroom.id, quantity, startDate);

        // Calcular fecha de retorno basada en los días de préstamo
        const calculatedReturnDate = returnDate;

        actions.addToCart(classroom.id, quantity, startDate, calculatedReturnDate);
        setAddedToCart(true);
        setTimeout(() => {
            setAddedToCart(false);
            setQuantity(1);
            onClose();
        }, 2000);
    };

    const getRentalDays = () => {
        return classroom.quantity === 1 ? 1 : 7;
    };

    const handleIncrease = () => {
        if (quantity < classroom.quantity - 1) {
            setQuantity(quantity + 1);
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const maxQuantityReached = quantity >= classroom.quantity;
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
                            {/* Columna de imagen - IZQUIERDA */}
                            <Grid item xs={12} md={6}>
                                <CardMedia
                                    component="img"
                                    image={classroom.image}
                                    alt={classroom.name}
                                    sx={{
                                        width: '200px', // Cambiado de 200px a 100%
                                        height: 300,
                                        objectFit: 'cover',
                                        borderRadius: 2,
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                                    }}
                                />
                            </Grid>

                            {/* Columna de información - DERECHA */}
                            <Grid item xs={12} md={6}>
                                <Box sx={{ mb: 3 }}>
                                    <Chip
                                        label={classroom.category}
                                        sx={{
                                            backgroundColor: '#D4AF37',
                                            color: 'white',
                                            mb: 2,
                                            fontSize: '0.9rem',
                                            fontWeight: 'bold'
                                        }}
                                    />
                                    <Typography variant="h4" fontWeight="bold" gutterBottom color="#8B0000">
                                        {classroom.name}
                                    </Typography>
                                    <Typography variant="body1" color="textSecondary" paragraph sx={{ lineHeight: 1.6 }}>
                                        {classroom.description}
                                    </Typography>
                                    
                                    {/* Información adicional del salón */}
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Capacidad:</strong> {classroom.capacity} personas
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Ubicación:</strong> {classroom.location}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            <strong>Equipamiento:</strong> {classroom.equipment.join(', ')}
                                        </Typography>
                                    </Box>
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
                                            color={classroom.available ? 'success.main' : 'error.main'}
                                        >
                                            {classroom.available ? 'Disponible' : 'No disponible'}
                                        </Typography>
                                        <Chip
                                            label={rentalDays === 1 ? "1 día" : "7 días"}
                                            color={rentalDays === 1 ? "warning" : "success"}
                                            variant="outlined"
                                            sx={{ fontWeight: 'bold' }}
                                        />
                                    </Box>

                                    {!classroom.available && (
                                        <Alert severity="error" sx={{ mb: 2 }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                ❌ Este salón no está disponible actualmente
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
                                                disabled={quantity <= 1 || !classroom.available}
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
                                                    color: !classroom.available ? 'text.disabled' : '#8B0000'
                                                }}
                                            >
                                                {quantity}
                                            </Typography>
                                            <QuantityButton
                                                onClick={handleIncrease}
                                                disabled={maxQuantityReached || !classroom.available}
                                                size="small"
                                            >
                                                <Add />
                                            </QuantityButton>
                                        </QuantitySelector>

                                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.9rem' }}>
                                            Salón completo
                                        </Typography>
                                    </Box>

                                    {!classroom.available && (
                                        <Alert severity="error" sx={{ mt: 1 }}>
                                            <Typography variant="body2" fontWeight="bold">
                                                ❌ No hay disponibilidad
                                            </Typography>
                                        </Alert>
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
                                                        Fin:
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight="bold" color="success.main">
                                                        {returnDate ? formatDate(returnDate) : '--'}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        )}

                                        <Alert severity="info" sx={{ mt: 2 }}>
                                            <Typography variant="body2">
                                                📌 <strong>Nota:</strong> El salón estará reservado para uso exclusivo durante el período seleccionado
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
                                        <Typography variant="body2" fontWeight="medium">Salón:</Typography>
                                        <Typography variant="body2" fontWeight="bold" color="#8B0000">
                                            {classroom.name}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                                        <Typography variant="body2" fontWeight="medium">Días de reserva:</Typography>
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
                                                <Typography variant="body2" fontWeight="medium">Fecha de fin:</Typography>
                                                <Typography variant="body2" fontWeight="bold" color="success.main">
                                                    {returnDate ? returnDate.toLocaleDateString('es-ES') : '--'}
                                                </Typography>
                                            </Box>
                                        </>
                                    )}
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
                                        📝 Política de Reserva
                                    </Typography>
                                    <Box sx={{ pl: 1 }}>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                            • 🎓 Servicio exclusivo para estudiantes universitarios
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                            • 📅 Reserva por días completos
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                            • ⏰ Horario de uso: 8:00 AM - 8:00 PM
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>
                                            • 📆 Los días de reserva se calculan a partir de la fecha de inicio seleccionada
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            • 🆔 Presentar credencial al acceder al salón
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
                            disabled={!classroom.available || addedToCart || !startDate}
                            sx={{
                                py: 1.5,
                                fontSize: '1.1rem'
                            }}
                        >
                            {addedToCart ? '✓ Añadido al Carrito' : `Reservar Salón`}
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
                                    Salón añadido al carrito. Redirigiendo...
                                </Typography>
                            </Alert>
                        )}

                        {!classroom.available && (
                            <Alert severity="error" sx={{ mt: 2 }}>
                                <Typography variant="body2" fontWeight="bold">
                                    ❌ Este salón no está disponible actualmente
                                </Typography>
                            </Alert>
                        )}
                    </Box>
                </DialogContent>
            </DetailsContainer>
        </Dialog>
    );
}