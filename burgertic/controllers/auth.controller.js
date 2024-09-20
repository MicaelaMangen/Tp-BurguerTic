import UsuariosService from "../services/usuarios.service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import usuariosService from "../services/usuarios.service.js";

const register = async (req, res) => {
    // --------------- COMPLETAR ---------------
    /*

        Recordar que para cumplir con toda la funcionalidad deben:

            1. Verificar que el body de la request tenga el campo usuario
            2. Verificar que el campo usuario tenga los campos nombre, apellido, email y password
            3. Verificar que no exista un usuario con el mismo email (utilizando el servicio de usuario)
            4. Devolver un mensaje de error si algo falló hasta el momento (status 400)
            5. Hashear la contraseña antes de guardarla en la base de datos
            6. Guardar el usuario en la base de datos (utilizando el servicio de usuario)
            7. Devolver un mensaje de éxito si todo salió bien (status 201)
            8. Devolver un mensaje de error si algo falló guardando al usuario (status 500)
        
    */
   try {
    const usuario = req.body

    if (!usuario.nombre || !usuario.apellido || !usuario.email || !usuario.password) {
        return res.status(400).json({ message: 'Faltan campos requeridos: nombre, apellido, email o password' });
    }
    else {
        const usuarioExistente = await usuariosService.getUsuarioByEmail(usuario.email);
        if (usuarioExistente) {
            return res.status(400).json({ message: 'Ya existe un usuario con este email' });
        }
        else {
            const hashed =  await bcrypt.hash(usuario.password, 10);
            const nuevoUsuario = {nombre: usuario.nombre, apellido: usuario.apellido, email: usuario.email, password: hashed}
            const guardarUsuario = await usuariosService.createUsuario(nuevoUsuario);
            return res.status(201).json({ message: 'El usuario se guardo correctamente' });
        }
    }
   }
   catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Algo salio mal registrando el usuario' });
   }
};

const login = async (req, res) => {
    // -------------- COMPLETAR ---------------
    /*

        Recordar que para cumplir con toda la funcionalidad deben:

            1. Verificar que el body de la request tenga el campo email y password
            2. Buscar un usuario con el email recibido
            3. Verificar que el usuario exista
            4. Verificar que la contraseña recibida sea correcta
            5. Devolver un mensaje de error si algo falló hasta el momento (status 400)
            6. Crear un token con el id del usuario y firmarlo con la clave secreta (utilizando la librería jsonwebtoken)
            7. Devolver un json con el usuario y el token (status 200)
            8. Devolver un mensaje de error si algo falló (status 500)
        
    */
   try {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Faltan campos requeridos: email o password' });
    }
    else {
        const usuarioExistente = await usuariosService.getUsuarioByEmail(email);
        if (usuarioExistente) {
            const passwordCorrecta = await bcrypt.compare(password, usuarioExistente.password);
            if (passwordCorrecta){
                const token = jwt.sign({ userId: usuarioExistente.id, email: usuarioExistente.email }, process.env.SECRET_KEY);
                return res.status(200).json({ message:{ nombre: usuarioExistente.nombre, apellido: usuarioExistente.apellido, email: usuarioExistente.email, token} });
            }
            else {
                res.status(400).json({ error: 'La contraseña es incorrecta' });
            }
        }
        else {
            return res.status(400).json({ error: 'No existe un usuario con este mail'});
        }
    }
   }
   catch (err){
    console.error(err);
    return res.status(500).json({ error: 'Error en el servidor'});
   }
   
};

export default { register, login };
