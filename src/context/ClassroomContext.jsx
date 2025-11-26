import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  classrooms: [
    {
      id: 1,
      name: 'Sala de Edición 1',
      capacity: 8,
      equipment: ['iMac Pro', 'Adobe Creative Cloud', 'Tabletas gráficas'],
      image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'Edición',
      description: 'Sala especializada para edición de video y diseño gráfico',
      available: true,
      location: 'Edificio A, Piso 3',
      quantity: 1
    },
    {
      id: 2,
      name: 'Estudio de Grabación',
      capacity: 6,
      equipment: ['Micrófonos profesionales', 'Mixer', 'Aislamiento acústico'],
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'Audio',
      description: 'Estudio profesional para grabación de audio y podcast',
      available: true,
      location: 'Edificio B, Piso 2',
      quantity: 1
    },
    {
      id: 3,
      name: 'Sala de Proyección',
      capacity: 20,
      equipment: ['Proyector 4K', 'Sistema de sonido 7.1', 'Pantalla 120"'],
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'Proyección',
      description: 'Sala de cine para proyección y análisis de material audiovisual',
      available: true,
      location: 'Edificio C, Piso 1',
      quantity: 1
    },
    {
      id: 4,
      name: 'Laboratorio de Fotografía',
      capacity: 10,
      equipment: ['Cámaras DSLR', 'Estudio de luces', 'Fondos profesionales'],
      image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'Fotografía',
      description: 'Estudio fotográfico profesional con equipo especializado',
      available: true,
      location: 'Edificio A, Piso 2',
      quantity: 1
    },
    {
      id: 5,
      name: 'Sala de Reuniones Audiovisual',
      capacity: 12,
      equipment: ['Pantalla táctil', 'Sistema de videoconferencia', 'Pizarra digital'],
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'Reuniones',
      description: 'Sala equipada para presentaciones y reuniones colaborativas',
      available: true,
      location: 'Edificio B, Piso 1',
      quantity: 1
    },
    {
      id: 6,
      name: 'Sala de Postproducción',
      capacity: 6,
      equipment: ['Workstations HP Z8', 'Monitores 4K', 'Sistema de almacenamiento NAS'],
      image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'Edición',
      description: 'Sala avanzada para postproducción y efectos visuales',
      available: true,
      location: 'Edificio A, Piso 3',
      quantity: 1
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
  SUBMIT_FOR_APPROVAL: 'SUBMIT_FOR_APPROVAL',
  APPROVE_RESERVATION: 'APPROVE_RESERVATION',
  REJECT_RESERVATION: 'REJECT_RESERVATION'
};

const classroomReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_TO_CART:
      const { classroomId, quantity, startDate, returnDate } = action.payload;

      const classroom = state.classrooms.find(c => c.id === classroomId);
      if (!classroom) return state;

      const existingItem = state.cart.find(item => item.id === classroomId);

      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === classroomId
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
          id: classroom.id,
          name: classroom.name,
          category: classroom.category,
          image: classroom.image,
          quantity: quantity,
          rentalDays: classroom.quantity === 1 ? 1 : 7,
          startDate: startDate,
          returnDate: returnDate,
          type: 'classroom',
          capacity: classroom.capacity,
          location: classroom.location
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
        type: 'classroom'
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

    default:
      return state;
  }
};

const ClassroomContext = createContext();

export const ClassroomProvider = ({ children }) => {
  const [state, dispatch] = useReducer(classroomReducer, initialState);

  const actions = {
    addToCart: (classroomId, quantity, startDate, returnDate) => dispatch({
      type: ACTIONS.ADD_TO_CART,
      payload: { classroomId, quantity, startDate, returnDate }
    }),

    removeFromCart: (classroomId) => dispatch({
      type: ACTIONS.REMOVE_FROM_CART,
      payload: classroomId
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
    })
  };

  return (
    <ClassroomContext.Provider value={{ state, actions }}>
      {children}
    </ClassroomContext.Provider>
  );
};

export const useClassroom = () => {
  const context = useContext(ClassroomContext);
  if (!context) {
    throw new Error('useClassroom debe usarse dentro de ClassroomProvider');
  }
  return context;
};