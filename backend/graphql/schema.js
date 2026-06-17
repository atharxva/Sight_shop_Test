import { buildSchema } from 'graphql';
import AppointmentModel from '../database/datamodels/apointment.js';
import EyeSpecialist from '../database/datamodels/doctors.js';
import mongoose from 'mongoose';

const typeDefs = `
  type Doctor {
    _id: ID!
    name: String!
    specialization: [String!]!
    qualification: String
    experience: String
    email: String
    phone: String
    image: String
    description: String
  }

  type Appointment {
    _id: ID!
    userId: String!
    doctorId: String!
    appointmentDate: String!
    appointmentTime: String!
    purpose: String!
    status: String!
    doctor: Doctor
  }

  type Query {
    getAppointmentsByUserId(userId: String!): [Appointment]
    getAllDoctors: [Doctor]
    getDoctorsBySpecialization(specialization: String!): [Doctor]
  }
`;

const resolvers = {
  Query: {
    getAppointmentsByUserId: async (_, { userId }) => {
      try {
        console.log('Backend: Fetching appointments for userId:', userId);
        
        let objectId;
        try {
          objectId = new mongoose.Types.ObjectId(userId);
        } catch (error) {
          console.error('Invalid userId format:', error);
          return [];
        }
        
        const appointments = await AppointmentModel.find({ userId: objectId })
          .sort({ appointmentDate: -1 });
        console.log('Backend: Found appointments for user:', JSON.stringify(appointments, null, 2));
        
        if (!appointments.length) {
          console.log('No appointments found for userId:', userId);
          return [];
        }
        
        const appointmentsWithDoctors = await Promise.all(
          appointments.map(async (appointment) => {
            console.log('Backend: Fetching doctor for appointment:', appointment._id);
            const doctor = await EyeSpecialist.findById(appointment.doctorId);
            console.log('Backend: Found doctor:', doctor ? doctor._id : 'null');
            
            const appointmentObj = appointment.toObject();
            const date = new Date(appointmentObj.appointmentDate);
            
            return {
              ...appointmentObj,
              _id: appointmentObj._id.toString(),
              userId: appointmentObj.userId.toString(),
              doctorId: appointmentObj.doctorId.toString(),
              appointmentDate: date.toISOString().split('T')[0],
              doctor: doctor ? {
                _id: doctor._id.toString(),
                name: doctor.name,
                specialization: doctor.specialization
              } : null
            };
          })
        );
        
        console.log('Backend: Final appointments with doctors:', JSON.stringify(appointmentsWithDoctors, null, 2));
        return appointmentsWithDoctors;
      } catch (error) {
        console.error('Backend Error fetching appointments:', error);
        throw new Error('Failed to fetch appointments');
      }
    },

    getAllDoctors: async () => {
      try {
        const doctors = await EyeSpecialist.find({});
        return doctors.map(doctor => ({
          ...doctor.toObject(),
          _id: doctor._id.toString()
        }));
      } catch (error) {
        console.error('Error fetching doctors:', error);
        throw new Error('Failed to fetch doctors');
      }
    },

    getDoctorsBySpecialization: async (_, { specialization }) => {
      try {
        console.log('Fetching doctors with specialization:', specialization);
        const doctors = await EyeSpecialist.find({ 
          specialization: { $elemMatch: { $regex: new RegExp(specialization, 'i') } } 
        });
        
        return doctors.map(doctor => ({
          ...doctor.toObject(),
          _id: doctor._id.toString()
        }));
      } catch (error) {
        console.error('Error fetching doctors by specialization:', error);
        throw new Error('Failed to fetch doctors by specialization');
      }
    }
  }
};

export const schema = buildSchema(typeDefs);

export const root = {
  getAppointmentsByUserId: resolvers.Query.getAppointmentsByUserId,
  getAllDoctors: resolvers.Query.getAllDoctors,
  getDoctorsBySpecialization: resolvers.Query.getDoctorsBySpecialization
};
