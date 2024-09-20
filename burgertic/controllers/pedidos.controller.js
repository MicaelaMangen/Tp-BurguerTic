import pedidosService from "../services/pedidos.service.js";

const getPedidos = async (req, res) => {
    // --------------- COMPLETAR ---------------
    /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener todos los pedidos
            2. Devolver un json con los pedidos (status 200)
            3. Devolver un mensaje de error si algo falló (status 500)
        
    */
   try {
    const pedidos = await pedidosService.getPedidos();
    return res.status(200).json({ message: pedidos});
   }
   catch {
    return res.status(500).json({ error: 'Error en el servidor'})
   }
};

const getPedidosByUser = async (req, res) => {
    // --------------- COMPLETAR ---------------
    /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener los pedidos del usuario
            2. Si el usuario no tiene pedidos, devolver un mensaje de error (status 404)
            3. Si el usuario tiene pedidos, devolver un json con los pedidos (status 200)
            4. Devolver un mensaje de error si algo falló (status 500)
        
    */
   try {
    const userid = req.userId;
    console.log("userid",userid);
    const pedidoByUser = await pedidosService.getPedidosByUser(userid.id);
    console.log("pbu", pedidoByUser);
    if (!pedidoByUser) {
        return res.status(404).json({ error: 'El usuario no tiene pedidos'})
    }
    else {
        return res.status(200).json({ message: pedidoByUser})
    }
   }
   catch (err){
    console.error(err)
    return res.status(500).json({ error: 'Error en el servidor' })
   }
};

const getPedidoById = async (req, res) => {
    // --------------- COMPLETAR ---------------
    /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener el pedido por id (utilizando el id recibido en los parámetros de la request)
            2. Si el pedido no existe, devolver un mensaje de error (status 404)
            3. Si el pedido existe, devolver un json con el pedido (status 200)
            4. Devolver un mensaje de error si algo falló (status 500)
        
    */
   try{
    const pedidoID = req.params.id;
    const pedido = await pedidosService.getPedidoById(pedidoID);
    if (!pedido) {
        return res.status(404).json({ error: 'El pedido no existe'})
    }
    else {
        return res.status(200).json({ message: pedido })
    }
   }
   catch(err) {
    console.error(err)
    return res.status(500).json({ error: 'Error del servidor'})
   }
};

const createPedido = async (req, res) => {
    // --------------- COMPLETAR ---------------
    /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Verificar que el body de la request tenga el campo platos
            2. Verificar que el campo productos sea un array
            3. Verificar que el array de productos tenga al menos un producto
            4. Verificar que todos los productos tengan un id y una cantidad
            5. Si algo de lo anterior no se cumple, devolver un mensaje de error (status 400)
            6. Crear un pedido con los productos recibidos y el id del usuario (utilizando el servicio de pedidos)
            7. Devolver un mensaje de éxito (status 201)
            8. Devolver un mensaje de error si algo falló (status 500)
        
    */
   
    try{
        const pedido = req.body;
        const platos = pedido.platos
        if(!platos) {
            return res.status(400).json({ error: 'Se requiere el campo platos'})
        }
        
        if (!Array.isArray(platos)) {
            return res.status(400).json({ message: 'El campo platos debe ser un array.' });
        }

        if (platos.length === 0) {
            return res.status(400).json({ message: 'El array de platos debe tener al menos 1 producto.' });
        }

        for (const plato of platos) {
            if (!plato.id || !plato.cantidad) {
                return res.status(400).json({ message: 'Todos los platos deben tener un id y una cantidad.' });
            }
        }

        const userId = req.userId;
        const nuevoPedido = await pedidosService.createPedido(userId, platos);

        return res.status(201).json({ message: 'Pedido creado exitosamente.', pedido: nuevoPedido });
    }
    catch (err){
        console.error(err);
        return res.status(500).json({ error: 'Error del servidor'})
    }
};

const aceptarPedido = async (req, res) => {
    // --------------- COMPLETAR ---------------
    /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener el pedido por id (utilizando el id recibido en los parámetros de la request)
            2. Si el pedido no existe, devolver un mensaje de error (status 404)
            3. Si el pedido existe, verificar que el pedido esté en estado "pendiente"
            4. Si el pedido no está en estado "pendiente", devolver un mensaje de error (status 400)
            5. Si el pedido está en estado "pendiente", actualizar el estado del pedido a "aceptado"
            6. Devolver un mensaje de éxito (status 200)
            7. Devolver un mensaje de error si algo falló (status 500)
        
    */
    try{
        const pedidoID = req.params.id;
        const pedido = await pedidosService.getPedidoById(pedidoID);
        if (!pedido) {
            return res.status(404).json({ error: 'El pedido no existe'});
        }
        if (pedido[0].estado != "pendiente") {
            return res.status(400).json({ error: 'El pedido no esta pendiente'});
        }
        const pedidoAceptado = await pedidosService.updatePedido(pedido[0].id, "aceptado");
        return res.status(200).json({ message: 'El pedido fue aceptado'})
    }
    catch {
        return res.status(500).json({ error: 'Error del servidor'})
    }
};

const comenzarPedido = async (req, res) => {
    // --------------- COMPLETAR ---------------
    /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener el pedido por id (utilizando el id recibido en los parámetros de la request)
            2. Si el pedido no existe, devolver un mensaje de error (status 404)
            3. Si el pedido existe, verificar que el pedido esté en estado "aceptado"
            4. Si el pedido no está en estado "aceptado", devolver un mensaje de error (status 400)
            5. Si el pedido está en estado "aceptado", actualizar el estado del pedido a "en camino"
            6. Devolver un mensaje de éxito (status 200)
            7. Devolver un mensaje de error si algo falló (status 500)
        
    */
    try{
        const pedidoID = req.params.id;
        const pedido = await pedidosService.getPedidoById(pedidoID);
        if (!pedido) {
            return res.status(404).json({ error: 'El pedido no existe'});
        }
        if (pedido[0].estado != "aceptado") {
            return res.status(400).json({ error: 'El pedido no esta aceptado'});
        }
        const pedidoEnCamino = await pedidosService.updatePedido(pedido[0].id, "en camino");
        return res.status(200).json({ message: 'El pedido esta en camino'})
    }
    catch {
        return res.status(500).json({ error: 'Error del servidor'})
    }
};

const entregarPedido = async (req, res) => {
    // --------------- COMPLETAR ---------------
    /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener el pedido por id (utilizando el id recibido en los parámetros de la request)
            2. Si el pedido no existe, devolver un mensaje de error (status 404)
            3. Si el pedido existe, verificar que el pedido esté en estado "en camino"
            4. Si el pedido no está en estado "en camino", devolver un mensaje de error (status 400)
            5. Si el pedido está en estado "en camino", actualizar el estado del pedido a "entregado"
            6. Devolver un mensaje de éxito (status 200)
            7. Devolver un mensaje de error si algo falló (status 500)
        
    */
    try{
        const pedidoID = req.params.id;
        const pedido = await pedidosService.getPedidoById(pedidoID);
        if (!pedido) {
            return res.status(404).json({ error: 'El pedido no existe'});
        }
        if (pedido[0].estado != "en camino") {
            return res.status(400).json({ error: 'El pedido no esta en camino'});
        }
        const pedidoEntregado = await pedidosService.updatePedido(pedido[0].id, "entregado");
        return res.status(200).json({ message: 'El pedido esta entregado'})
    }
    catch {
        return res.status(500).json({ error: 'Error del servidor'})
    }
};

const deletePedido = async (req, res) => {
    // --------------- COMPLETAR ---------------
    /*
        Recordar que para cumplir con toda la funcionalidad deben:

            1. Utilizar el servicio de pedidos para obtener el pedido por id (utilizando el id recibido en los parámetros de la request)
            2. Si el pedido no existe, devolver un mensaje de error (status 404)
            3. Si el pedido existe, eliminar el pedido
            4. Devolver un mensaje de éxito (status 200)
            5. Devolver un mensaje de error si algo falló (status 500)
        
    */
    try{
        const pedidoID = req.params.id;
        const pedido = await pedidosService.getPedidoById(pedidoID);
        if (!pedido) {
            return res.status(404).json({ error: 'El pedido no existe'});
        }
        const eliminarPedido = await pedidosService.deletePedido(pedidoID);
        return res.status(200).json({ message: 'El pedido se elimino con exito' });
    }
    catch {
        return res.status(500).json({ error: 'Error del servidor'})
    }
};

export default {
    getPedidos,
    getPedidosByUser,
    getPedidoById,
    createPedido,
    aceptarPedido,
    comenzarPedido,
    entregarPedido,
    deletePedido,
};
