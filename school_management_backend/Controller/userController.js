import User from '../Model/userModel.js';  // Assuming User model is imported correctly
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";  // Import mongoose for ObjectId validation



export const login = async(req,res)=>{
    const {email,password} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET);
        res.status(200).json({token});
    }catch(error) {
        // If an error occurs, respond with status 500 and the error message
        res.status(500).json({ message: error.message });
    }
};



export const register = async (req, res) => {
    const { fullName, email, password, role, dateOfBirth, phoneNumber, address, profilePicture } = req.body; // Use req.body instead of req.params

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password using bcrypt
        const hashPassword = await bcrypt.hash(password, 10);

        // Create the user in the database
        const user = await User.create({
            fullName,
            email,
            password: hashPassword,
            role,
            dateOfBirth,
            phoneNumber,
            address,
            profilePicture,
        });

        // Return the created user (you can modify this to exclude sensitive data like the password)
        return res.status(200).json({ user });
    } catch (error) {
        // If an error occurs, respond with status 500 and the error message
        return res.status(500).json({ message: error.message });
    }
};




