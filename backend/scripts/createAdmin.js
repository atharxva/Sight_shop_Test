import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import AdminModel from '../database/datamodels/Admin.js';

const createAdmin = async () => {
    let connection;
    try {
        console.log('Attempting to connect to MongoDB...');
        connection = await mongoose.connect("mongodb://localhost:27017/lenskart", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Successfully connected to MongoDB');


        const collections = await connection.connection.db.listCollections().toArray();
        console.log('Available collections:', collections.map(c => c.name));


        await connection.connection.db.dropCollection('admins').catch(() => console.log('No existing admins collection'));
        console.log('Cleared existing admins collection');


        const existingAdmin = await AdminModel.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        console.log('Password hashed successfully');

        const newAdmin = new AdminModel({
            username: 'admin',
            password: hashedPassword
        });

        await newAdmin.save();
        console.log('Admin user saved to database');


        const verifyAdmin = await AdminModel.findOne({ username: 'admin' });
        if (verifyAdmin) {
            console.log('Verification successful - Admin details:');
            console.log('Username:', verifyAdmin.username);
            console.log('Password hash:', verifyAdmin.password);
        } else {
            console.log('WARNING: Admin user was not found after creation!');
        }

        console.log('\nAdmin credentials for login:');
        console.log('Username: admin');
        console.log('Password: admin123');

    } catch (error) {
        console.error('Error in createAdmin script:', error);
    } finally {
        if (connection) {
            await connection.disconnect();
            console.log('Disconnected from MongoDB');
        }
    }
};

createAdmin();
