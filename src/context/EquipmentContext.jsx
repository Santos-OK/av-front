import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  equipment: [
    {
      id: 1,
      name: 'Cámara Canon EOS R5',
      category: 'Cámaras',
      description: 'Cámara mirrorless profesional con resolución 8K',
      image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      quantity: 3,
      available: true
    },
    {
      id: 2,
      name: 'Trípode Manfrotto',
      category: 'Soportes',
      description: 'Trípode profesional para cámaras pesadas',
      image: 'https://images.unsplash.com/photo-1554048612-7c6c62b32f0f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      quantity: 5,
      available: true
    },
    {
      id: 3,
      name: 'Micrófono Rode NT1',
      category: 'Audio',
      description: 'Micrófono de condensador para estudio',
      image: 'https://images.unsplash.com/photo-1590602847861-f357a9332c7f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      quantity: 2,
      available: true
    },
    {
      id: 4,
      name: 'Luz LED Profesional',
      category: 'Iluminación',
      description: 'Kit de iluminación LED para video',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      quantity: 4,
      available: true
    },
    {
      id: 5,
      name: 'Grabadora Zoom H6',
      category: 'Audio',
      description: 'Grabadora de audio portátil multipista',
      image: 'https://images.unsplash.com/photo-1571019614242-c5e5d5e3b5b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      quantity: 1,
      available: true
    },
    {
      id: 6,
      name: 'Drone DJI Mavic 3',
      category: 'Drones',
      description: 'Drone profesional con cámara 4K',
      image: 'https://images.unsplash.com/photo-1578305698944-874b04d2f4c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      quantity: 2,
      available: false
    }
  ],
  cart: [],
  reservations: [],
  notifications: [],
  pendingApprovals: []
};

const ACTIONS = {
  ADD_TO_CART: 'ADD_TO_CART',
  REMOVE_FROM_CART: 'REMOVE_FROM_CART',
  CLEAR_CART: 'CLEAR_CART',
  CONFIRM_RESERVATION: 'CONFIRM_RESERVATION',
  ADD_EQUIPMENT: 'ADD_EQUIPMENT',
  SUBMIT_FOR_APPROVAL: 'SUBMIT_FOR_APPROVAL',
  APPROVE_RESERVATION: 'APPROVE_RESERVATION',
  REJECT_RESERVATION: 'REJECT_RESERVATION'
};

const equipmentReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_TO_CART:
      const { equipmentId, quantity, startDate, returnDate } = action.payload;

      const equipment = state.equipment.find(e => e.id === equipmentId);
      if (!equipment) return state;

      const existingItem = state.cart.find(item => item.id === equipmentId);

      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === equipmentId
              ? {
                ...item,
                quantity: item.quantity + quantity,
                startDate: startDate,
                returnDate: returnDate
              }
              : item
          )
        };
      } else {
        const cartItem = {
          id: equipment.id,
          name: equipment.name,
          category: equipment.category,
          image: equipment.image,
          quantity: quantity,
          rentalDays: equipment.quantity === 1 ? 1 : 7,
          startDate: startDate,
          returnDate: returnDate,
          type: 'equipment'
        };

        return {
          ...state,
          cart: [...state.cart, cartItem]
        };
      }

    case ACTIONS.REMOVE_FROM_CART:
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };

    case ACTIONS.CLEAR_CART:
      return {
        ...state,
        cart: []
      };

    case ACTIONS.SUBMIT_FOR_APPROVAL:
      if (state.cart.length === 0) return state;

      const pendingReservation = {
        id: Date.now(),
        date: new Date().toLocaleString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        items: [...state.cart],
        status: 'pending',
        userId: 'user123',
        userName: 'Estudiante Universitario',
        type: 'equipment'
      };

      return {
        ...state,
        pendingApprovals: [pendingReservation, ...state.pendingApprovals],
        notifications: [pendingReservation, ...state.notifications],
        cart: []
      };

    case ACTIONS.APPROVE_RESERVATION:
      const reservationToApprove = state.pendingApprovals.find(
        r => r.id === action.payload.reservationId
      );

      if (!reservationToApprove) return state;

      const approvedReservation = {
        ...reservationToApprove,
        status: 'approved',
        approvedDate: new Date().toLocaleString('es-MX'),
        approvedBy: 'admin'
      };

      return {
        ...state,
        pendingApprovals: state.pendingApprovals.filter(
          r => r.id !== action.payload.reservationId
        ),
        reservations: [approvedReservation, ...state.reservations],
        notifications: state.notifications.map(notif =>
          notif.id === action.payload.reservationId
            ? approvedReservation
            : notif
        )
      };

    case ACTIONS.REJECT_RESERVATION:
      const reservationToReject = state.pendingApprovals.find(
        r => r.id === action.payload.reservationId
      );

      if (!reservationToReject) return state;

      const rejectedReservation = {
        ...reservationToReject,
        status: 'rejected',
        rejectedDate: new Date().toLocaleString('es-MX'),
        rejectedBy: 'admin',
        rejectionReason: action.payload.reason || 'Sin especificar'
      };

      return {
        ...state,
        pendingApprovals: state.pendingApprovals.filter(
          r => r.id !== action.payload.reservationId
        ),
        notifications: state.notifications.map(notif =>
          notif.id === action.payload.reservationId
            ? rejectedReservation
            : notif
        )
      };

    case ACTIONS.ADD_EQUIPMENT:
      const newEquipment = {
        id: Date.now(),
        name: action.payload.name,
        category: action.payload.category,
        description: action.payload.description,
        image: action.payload.image,
        quantity: parseInt(action.payload.quantity) || 1,
        available: true
      };

      return {
        ...state,
        equipment: [...state.equipment, newEquipment]
      };

    default:
      return state;
  }
};

const EquipmentContext = createContext();

export const EquipmentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(equipmentReducer, initialState);

  const actions = {
    addToCart: (equipmentId, quantity, startDate, returnDate) => dispatch({
      type: ACTIONS.ADD_TO_CART,
      payload: { equipmentId, quantity, startDate, returnDate }
    }),

    removeFromCart: (equipmentId) => dispatch({
      type: ACTIONS.REMOVE_FROM_CART,
      payload: equipmentId
    }),

    clearCart: () => dispatch({
      type: ACTIONS.CLEAR_CART
    }),

    submitForApproval: () => dispatch({
      type: ACTIONS.SUBMIT_FOR_APPROVAL
    }),

    approveReservation: (reservationId) => dispatch({
      type: ACTIONS.APPROVE_RESERVATION,
      payload: { reservationId }
    }),

    rejectReservation: (reservationId, reason) => dispatch({
      type: ACTIONS.REJECT_RESERVATION,
      payload: { reservationId, reason }
    }),

    addEquipment: (equipmentData) => dispatch({
      type: ACTIONS.ADD_EQUIPMENT,
      payload: equipmentData
    })
  };

  return (
    <EquipmentContext.Provider value={{ state, actions }}>
      {children}
    </EquipmentContext.Provider>
  );
};

export const useEquipment = () => {
  const context = useContext(EquipmentContext);
  if (!context) {
    throw new Error('useEquipment debe usarse dentro de EquipmentProvider');
  }
  return context;
};