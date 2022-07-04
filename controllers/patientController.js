import Patient from '../models/Patient.js';

const addPatient = async (req, res) => {

    const patient = new Patient(req.body);
    patient.veterinary = req.veterinary._id;
    
    try {
        const savedPatient = await patient.save()
        res.json(savedPatient);
    } catch (error) {
        console.log(error);
    }
};

const getPatients = async (req, res) => {
    const patients = await Patient.find().where('veterinary').equals(req.veterinary);

    res.json(patients);
};

const getPatient = async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id);

    if( !patient ) {
        return res.status(404).json({ msg: 'No encontrado' });
    }

    if( patient.veterinary._id.toString() !== req.veterinary._id.toString() ) {
        return res.json({ msg: 'Accion no valida' });
    }

    res.json(patient);
};

const updatePatient = async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id);

    if( !patient ) {
        return res.status(404).json({ msg: 'No encontrado' });
    }

    if( patient.veterinary._id.toString() !== req.veterinary._id.toString() ) {
        return res.json({ msg: 'Accion no valida' });
    }

    // Update patient
    patient.name = req.body.name || patient.name;
    patient.owner = req.body.owner || patient.owner;
    patient.email = req.body.email || patient.email;
    patient.date = req.body.date || patient.date;
    patient.symptoms = req.body.symptoms || patient.symptoms;

    try {
        const savedPatient = await patient.save();
        res.json(savedPatient);
    } catch (error) {
        console.log(error);
    }
};

const deletePatient = async (req, res) => {
    const { id } = req.params;
    const patient = await Patient.findById(id);

    if( !patient ) {
        return res.status(404).json({ msg: 'No encontrado' });
    }

    if( patient.veterinary._id.toString() !== req.veterinary._id.toString() ) {
        return res.json({ msg: 'Accion no valida' });
    }

    try {
        await patient.deleteOne();
        res.json({ msg: 'Paciente Eliminado' });
    } catch (error) {
        console.log(error);
    }
};

export {
    addPatient,
    getPatients,
    getPatient,
    updatePatient,
    deletePatient
};