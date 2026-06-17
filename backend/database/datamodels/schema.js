import {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList,
} from "graphql";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AppointmentModel from "./apointment.js";
import AdminModel from "./Admin.js";
import userModel from "./user.js";
import EyeSpecialist from "./doctors.js";

const secretKey = "your_secret_key";

const DoctorType = new GraphQLObjectType({
  name: "Doctor",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    specialization: { type: GraphQLString },
  }),
});

const AppointmentType = new GraphQLObjectType({
  name: "Appointment",
  fields: () => ({
    id: { type: GraphQLID },
    userId: { type: GraphQLString },
    doctorId: { type: GraphQLString },
    appointmentDate: { type: GraphQLString },
    appointmentTime: { type: GraphQLString },
    purpose: { type: GraphQLString },
    status: { type: GraphQLString },
    doctor: {
      type: DoctorType,
      resolve: async (appointment) => {
        return await EyeSpecialist.findById(appointment.doctorId);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    fname: { type: GraphQLString },
    lname: { type: GraphQLString },
    email: { type: GraphQLString },
    gender: { type: GraphQLString },
  }),
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    pendingAppointments: {
      type: new GraphQLList(AppointmentType),
      resolve: async (_, args, context) => {
        if (!context.isAdmin) throw new Error("Unauthorized access");
        return await AppointmentModel.find({ status: "Pending" });
      },
    },

    confirmedAppointments: {
      type: new GraphQLList(AppointmentType),
      resolve: async (_, args, context) => {
        if (!context.isAdmin) throw new Error("Unauthorized access");
        return await AppointmentModel.find({ status: "Confirmed" });
      },
    },
    getUserByEmail: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { email }) => {
        const user = await userModel.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }
        return user;
      },
    },
    getUserAppointments: {
      type: new GraphQLList(AppointmentType),
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { email }) => {
        const user = await userModel.findOne({ email });
        if (!user) {
          throw new Error("User not found");
        }
        return await AppointmentModel.find({ userId: user._id }).sort({ appointmentDate: -1 });
      },
    },
    getAppointmentsByUserId: {
      type: new GraphQLList(AppointmentType),
      args: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { userId }) => {
        console.log('Fetching appointments for userId:', userId);
        try {
          const appointments = await AppointmentModel.find({ userId })
            .sort({ appointmentDate: -1 });
          
          console.log('Found appointments:', appointments);
          return appointments || [];
        } catch (error) {
          console.error('Error fetching appointments:', error);
          throw new Error('Failed to fetch appointments');
        }
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    adminLogin: {
      type: GraphQLString,
      args: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { username, password }) => {
        const admin = await AdminModel.findOne({ username });
        if (!admin) throw new Error("Invalid credentials");

        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) throw new Error("Invalid credentials");

        const token = jwt.sign({ id: admin._id, role: "admin" }, secretKey, {
          expiresIn: "1h",
        });

        return token;
      },
    },
    changeAppointmentStatus: {
      type: AppointmentType,
      args: {
        appointmentId: { type: new GraphQLNonNull(GraphQLID) },
        status: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { appointmentId, status }, context) => {
        if (!context.isAdmin) throw new Error("Unauthorized access");

        const validStatuses = [
          "Pending",
          "Confirmed",
          "Cancelled",
          "Completed",
        ];
        if (!validStatuses.includes(status)) {
          throw new Error("Invalid status");
        }

        const appointment = await AppointmentModel.findByIdAndUpdate(
          appointmentId,
          { status },
          { new: true }
        );

        if (!appointment) throw new Error("Appointment not found");
        return appointment;
      },
    },
  },
});

export default new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
