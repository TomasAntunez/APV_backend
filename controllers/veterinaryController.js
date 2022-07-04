import Veterinary from "../models/Veterinary.js";
import generateJWT from "../helpers/generateJWT.js";
import generateId from "../helpers/generateId.js";
import emailRegistration from "../helpers/emailRegistration.js";
import emailForgetPassword from "../helpers/emailForgetPassword.js";

const register = async (req, res) => {
    const { email, name } = req.body;

    // Prevent duplicated user
    const userExists = await Veterinary.findOne({ email })

    if( userExists ) {
        const error = new Error('Usuario ya registrado');
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Save a new vet
        const veterinary = new Veterinary(req.body);
        veterinary.token = generateId();
        const savedVet = await veterinary.save();
        
        // Send the email
        emailRegistration({
            email,
            name,
            token: savedVet.token
        });

        res.json(savedVet);
        console.log(savedVet);

    } catch (error) {
        console.log(error);
    }
}

const profile = (req, res) => {
    const { veterinary } = req;

    res.json( veterinary );
}

const confirm = async (req, res) => {

    const { token } = req.params;
    const userConfirm = await Veterinary.findOne({ token });

    if( !userConfirm ) {
        const error = new Error('Token no valido');
        return res.status(404).json({ msg: error.message });
    }

    try {
        userConfirm.token = null;
        userConfirm.confirmed = true;
        await userConfirm.save();

        res.json({ msg: 'Usuario confirmado correctamente' });

    } catch (error) {
        console.log(error);
    }
};

const authenticate = async (req, res) => {
    const { email, password } = req.body

    // Check if user exists
    const user = await Veterinary.findOne({email});

    if( !user ) {
        const error = new Error('El usuario no existe');
        return res.status(404).json({ msg: error.message });
    }

    // Check if the user is confirmed
    if( !user.confirmed ) {
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({ msg: error.message });
    }

    // Check the password
    if( await user.checkPassword(password) ) {
        // Authenticate
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateJWT(user.id)
        });
    } else {
        const error = new Error('El password es incorrecto');
        return res.status(403).json({ msg: error.message });
    }
};

const forgetPassword = async (req, res) => {
    const { email } = req.body;

    const vetExists = await Veterinary.findOne({ email });
    if( !vetExists ) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({ msg: error.message });
    }

    try {
        vetExists.token = generateId();
        await vetExists.save();

        // Send email with instructions
        emailForgetPassword({
            email,
            name: vetExists.name,
            token: vetExists.token
        });

        res.json({ msg: 'Hemos enviado un mail con las instrucciones' });

    } catch (error) {
        console.log(error);
    }
};

const checkToken = async (req, res) => {
    const { token } = req.params;

    const validToken = await Veterinary.findOne({ token });

    if( validToken ) {
        // The token is valid, the user exists
        res.json({ msg: 'Token valido y el usuario existe' });
    } else {
        const error = new Error('Token no valido');
        return res.status(400).json({ msg: error.message });
    }
};

const newPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinary = await Veterinary.findOne({ token });
    if( !veterinary ) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message })
    }

    try {
        veterinary.token = null;
        veterinary.password = password;
        await veterinary.save();
        res.json({ msg: 'Password modificado correctamente' });

    } catch (error) {
        console.log(error);
    }
};

const updateProfile = async (req, res) => {
    const veterinary = await Veterinary.findById(req.params.id);

    if( !veterinary ) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    const { email } = req.body;
    if( veterinary.email !== email ) {
        const emailExists = await Veterinary.findOne({email});

        if( emailExists ) {
            const error = new Error('Ese email ya esta en uso');
            return res.status(400).json({ msg: error.message });
        }
    }

    try {
        veterinary.name = req.body.name;
        veterinary.phone = req.body.phone;
        veterinary.web = req.body.web;
        veterinary.email = req.body.email;

        const updatedVet = await veterinary.save();
        res.json(updatedVet);

    } catch (error) {
        console.log(error);
    }
};

const updatePassword = async (req, res) => {
    // Read data
    const { id } = req.veterinary;
    const { currentPassword, newPassword } = req.body;

    // Check that the vet exists
    const veterinary = await Veterinary.findById(id);
    if( !veterinary ) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    // Check password
    if( await veterinary.checkPassword(currentPassword) ) {
        // Save new password
        
        veterinary.password = newPassword;
        await veterinary.save();
        res.json({ msg: 'Password almacenado correctamente' })

    } else {
        const error = new Error('El password actual es incorrecto');
        return res.status(400).json({ msg: error.message });
    }
}

export {
    register,
    profile,
    confirm,
    authenticate,
    forgetPassword,
    checkToken,
    newPassword,
    updateProfile,
    updatePassword
}