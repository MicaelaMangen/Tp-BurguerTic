import jwt from "jsonwebtoken";
import UsuariosService from "../services/usuarios.service.js";

export const verifyToken = async (req, res, next) => {
    // --------------- COMPLETAR ---------------
    /*

        Recordar que para cumplir con toda la funcionalidad deben:

            1. Verificar si hay un token en los headers de autorización
            2. Verificar que el token esté en el formato correcto (Bearer <token>)
            3. Verificar que el token sea válido (utilizando la librería jsonwebtoken)
            4. Verificar que tenga un id de usuario al decodificarlo
    
        Recordar también que si sucede cualquier error en este proceso, deben devolver un error 401 (Unauthorized)
    */
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).send({ error: 'No llego ningun token en los headers' });
  }
  
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'El formato del Token es invalido' });
  }

  const token = tokenParts[1];
  const jwtSecret = process.env.SECRET_KEY;
  try {
    const decoded = jwt.verify(token, jwtSecret);
    
    if (!decoded.userId) {
      return res.status(401).send({ error: 'Token invalido: Usuario sin Id' });
    }
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).send({ error: 'Unauthorized' });
  }
};

export const verifyAdmin = async (req, res, next) => {
    // --------------- COMPLETAR ---------------
    /*

        Recordar que para cumplir con toda la funcionalidad deben:

            1. Verificar que el id de usuario en la request es un administrador (utilizando el servicio de usuarios)
            2. Si no lo es, devolver un error 403 (Forbidden)
    
    */
  try {
    const userId = req.userId;

    if (!userId) {
        return res.status(403).json({ message: 'No llego ningun Id' });
    }

    const user = await UsuariosService.getUsuarioById(userId);

    if (!user || !user.admin) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    req.userId = user.id;

    next();
  } 
  catch (error) {
      return res.status(500).json({ message: 'error del servidor', error: error.message });
  }
};
