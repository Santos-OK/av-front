import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Alert,
    styled,
    Paper
} from '@mui/material';
import { Inventory, AddPhotoAlternate, Save } from '@mui/icons-material';
import { useEquipment } from '../context/EquipmentContext'; // Importar el contexto
import { useNavigate } from 'react-router'; // Para redirigir después de agregar

// Colores
const tintoColor = '#8B0000';
const doradoColor = '#D4AF37';

const HeaderCard = styled(Card)(({ theme }) => ({
    backgroundColor: tintoColor,
    color: 'white',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));

const FormCard = styled(Card)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));

const DoradoButton = styled(Button)(({ theme }) => ({
    backgroundColor: doradoColor,
    color: '#FFF',
    fontWeight: 'bold',
    padding: theme.spacing(1.5, 3),
    '&:hover': {
        backgroundColor: '#B8860B',
    },
}));

export default function AddInventory() {
    const { actions } = useEquipment(); // Usar el contexto de Equipment
    const navigate = useNavigate(); // Para redirigir
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        quantity: '1',
        image: '',
        type: 'equipment'
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const categories = {
        equipment: ['Cámaras', 'Audio', 'Iluminación', 'Soportes', 'Drones', 'Accesorios'],
        classroom: ['Edición', 'Audio', 'Proyección', 'Fotografía', 'Reuniones']
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Limpiar errores cuando el usuario empiece a escribir
        if (error) setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validaciones básicas
        if (!formData.name.trim()) {
            setError('El nombre es requerido');
            return;
        }
        if (!formData.category) {
            setError('La categoría es requerida');
            return;
        }
        if (!formData.description.trim()) {
            setError('La descripción es requerida');
            return;
        }
        if (!formData.image.trim()) {
            setError('La URL de la imagen es requerida');
            return;
        }
        if (formData.type === 'equipment' && (!formData.quantity || parseInt(formData.quantity) < 1)) {
            setError('La cantidad debe ser al menos 1');
            return;
        }

        try {
            // Preparar los datos para el equipo
            const equipmentData = {
                name: formData.name.trim(),
                category: formData.category,
                description: formData.description.trim(),
                image: formData.image.trim(),
                quantity: formData.type === 'equipment' ? parseInt(formData.quantity) : 1
            };

            console.log('Agregando equipo:', equipmentData);

            // Llamar a la acción para agregar el equipo
            actions.addEquipment(equipmentData);

            setSuccess(true);
            setError('');

            // Resetear formulario después de 2 segundos y redirigir
            setTimeout(() => {
                setFormData({
                    name: '',
                    category: '',
                    description: '',
                    quantity: '1',
                    image: '',
                    type: 'equipment'
                });
                setSuccess(false);
                // Redirigir a la página de equipos
                navigate('/equipment');
            }, 2000);

        } catch (err) {
            setError('Error al agregar el equipo: ' + err.message);
            console.error('Error al agregar equipo:', err);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <HeaderCard>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Inventory sx={{ fontSize: 40 }} />
                    <Box>
                        <Typography variant="h4" fontWeight="bold">
                            Añadir al Inventario
                        </Typography>
                        <Typography variant="body1">
                            Agregar nuevos equipos al sistema
                        </Typography>
                    </Box>
                </Box>
            </HeaderCard>

            <Grid container spacing={4}>
                {/* Formulario */}
                <Grid item xs={12} md={8}>
                    <FormCard>
                        <Typography variant="h5" gutterBottom fontWeight="bold" color={tintoColor}>
                            📝 Nuevo Equipo
                        </Typography>

                        {success && (
                            <Alert severity="success" sx={{ mb: 3 }}>
                                ¡Equipo agregado exitosamente al inventario! Redirigiendo...
                            </Alert>
                        )}

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={3}>
                                {/* Nombre */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Nombre del Equipo"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ej: Cámara Sony A7III"
                                    />
                                </Grid>

                                {/* Categoría */}
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel>Categoría</InputLabel>
                                        <Select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            label="Categoría"
                                        >
                                            {categories.equipment.map((category) => (
                                                <MenuItem key={category} value={category}>
                                                    {category}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Cantidad */}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Cantidad Disponible"
                                        name="quantity"
                                        type="number"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        inputProps={{ min: 1 }}
                                        required
                                    />
                                </Grid>

                                {/* Descripción */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Descripción"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        multiline
                                        rows={3}
                                        required
                                        placeholder="Describe las características y especificaciones del equipo..."
                                    />
                                </Grid>

                                {/* Imagen */}
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="URL de la Imagen"
                                        name="image"
                                        value={formData.image}
                                        onChange={handleChange}
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                        required
                                        InputProps={{
                                            startAdornment: <AddPhotoAlternate sx={{ color: 'text.secondary', mr: 1 }} />
                                        }}
                                        helperText="Usa una URL de imagen de alta calidad"
                                    />
                                </Grid>

                                {/* Vista previa de la imagen */}
                                {formData.image && (
                                    <Grid item xs={12}>
                                        <Box sx={{ mt: 1 }}>
                                            <Typography variant="body2" color="textSecondary" gutterBottom>
                                                Vista previa:
                                            </Typography>
                                            <Box
                                                component="img"
                                                src={formData.image}
                                                alt="Vista previa"
                                                sx={{
                                                    maxWidth: '200px',
                                                    maxHeight: '150px',
                                                    objectFit: 'cover',
                                                    borderRadius: 1,
                                                    border: '1px solid #e0e0e0'
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        </Box>
                                    </Grid>
                                )}

                                {/* Botón de enviar */}
                                <Grid item xs={12}>
                                    <DoradoButton
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        startIcon={<Save />}
                                        sx={{ mt: 2 }}
                                    >
                                        Agregar al Inventario
                                    </DoradoButton>
                                </Grid>
                            </Grid>
                        </form>
                    </FormCard>
                </Grid>

                {/* Información lateral */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            💡 Información para Agregar Equipos
                        </Typography>
                        <Typography variant="body2" paragraph>
                            <strong>Nombre:</strong> Usa un nombre descriptivo y específico para el equipo.
                        </Typography>
                        <Typography variant="body2" paragraph>
                            <strong>Categoría:</strong> Selecciona la categoría que mejor describa el equipo.
                        </Typography>
                        <Typography variant="body2" paragraph>
                            <strong>Cantidad:</strong> Indica cuántas unidades están disponibles para préstamo.
                        </Typography>
                        <Typography variant="body2" paragraph>
                            <strong>Descripción:</strong> Incluye características técnicas y condiciones de uso.
                        </Typography>
                        <Typography variant="body2">
                            <strong>Imagen:</strong> Usa una imagen clara y profesional del equipo.
                        </Typography>

                        <Box sx={{ mt: 3, p: 2, backgroundColor: '#e8f5e8', borderRadius: 1 }}>
                            <Typography variant="body2" fontWeight="bold" color="#2E7D32">
                                ✅ El equipo aparecerá automáticamente en la página de "Equipo Disponible"
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}