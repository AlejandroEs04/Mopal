import nodemailer from 'nodemailer'
import formatearDinero from './formatearDinero.js';

export const emailCreateUser = async(datos) => {
    const { email, fullName, userName, password } = datos;

    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const msgHtml = `
        <div style="font-family: 'Roboto', sans-serif; background-color: #f5f5f5; padding: 15px 30px; border-radius: 5px;">
            <h2 style="margin: 4px;">Bienvenido <span style="color: #0a1a41; font-weight: 400;">${fullName}</span> a Mopal Grupo</h2>
            <p style="margin: 4px; font-size: 18px;">Su usuario ha sido creado y disponible para usar nuestro sistema de inventario en linea</p>
            <p style="margin: 4px; font-size: 18px;">Este usuario se ha enlazado al correo: <span style="font-weight: bold; color: #0a1a41;">${email}</span></p>
            <br/>
            <p style="margin: 4px; font-size: 18px;">A continuacion le mostraremos sus claves que usara para poder iniciar sesion</p>
            <p style="margin: 4px; font-size: 18px;">Nombre de usuario: <span style="font-weight: bold; color: #0a1a41;">${userName}</span></p>
            <p style="margin: 4px; font-size: 18px; margin-bottom: 20px;">Password: <span style="font-weight: bold; color: #0a1a41;">${password}</span></p>

            <a
                href="${process.env.FRONTEND_URL}/login"
                style="text-decoration: none; text-transform: uppercase; border: none; background-color: #0a1a41; color: white; padding: 10px 15px; font-size: 16px; border-radius: 5px; margin: 10px 0;"
            >
                Iniciar sesion
            </a>

            <p style="margin: 4px; font-size: 15px; margin-top: 20px;">En caso de no haber solicitado esta informacion, favor de ignorar el mensaje. </p>
        </div>
    `

    try {
        await transport.sendMail({
            from: "Mopal Grupo <accounts@mopalgrupo.com>", 
            to: email, 
            subject: "Respues a solicitud de crear usuario para el sistema de Inventario de Mopal Grupo", 
            text: "Claves para inicio de sesion en el sistema de inventario de Mopal", 
            html: msgHtml
        });
    } catch (error) {
        console.log(error)
    }
}

export const emailUpdateUser = async(datos) => {
    const { email, fullName, userName, password } = datos;

    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const msgHtml = `
        <div style="font-family: 'Roboto', sans-serif; background-color: #f5f5f5; padding: 15px 30px; border-radius: 5px;">
            <h2 style="margin: 4px;">Hola <span style="color: #0a1a41; font-weight: 400;">${fullName}</span>!</h2>
            <p style="margin: 4px; font-size: 18px;">Su contraseña ha sido actualizada</p>
            <br/>
            <p style="margin: 4px; font-size: 18px;">Estas a partir de ahora seran sus claves para ingresar al sistema</p>
            <p style="margin: 4px; font-size: 18px;">Nombre de usuario: <span style="font-weight: bold; color: #0a1a41;">${userName}</span></p>
            <p style="margin: 4px; font-size: 18px; margin-bottom: 20px;">Nuevo Password: <span style="font-weight: bold; color: #0a1a41;">${password}</span></p>

            <a
                href="${process.env.FRONTEND_URL}/login"
                style="text-decoration: none; text-transform: uppercase; border: none; background-color: #0a1a41; color: white; padding: 10px 15px; font-size: 16px; border-radius: 5px;"
            >
                Iniciar sesion
            </a>

            <p style="margin: 4px; font-size: 15px; margin-top: 20px;">En caso de no haber solicitado esta informacion, favor de ignorar el mensaje. </p>
        </div>
    `

    try {
        await transport.sendMail({
            from: "Mopal Grupo <accounts@mopalgrupo.com>", 
            to: email, 
            subject: "Respues a solicitud de crear usuario para el sistema de Inventario de Mopal Grupo", 
            text: "Claves para inicio de sesion en el sistema de inventario de Mopal", 
            html: msgHtml
        });
    } catch (error) {
        console.log(error)
    }

}

export const requestEmail = async(datos) => {
    const { bussinesName, userName, userEmail, Products, requestID } = datos;

    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    let msgHtml = `
        <div style="font-family: 'Roboto', sans-serif; background-color: #f5f5f5; padding: 15px 30px; border-radius: 5px;">
            <h2 style="margin: 4px;">Se realizo una solicitud</h2>
            <p style="margin: 4px; font-size: 18px;">Para que la solicitud sea aprobada, favor de leer la informacion de la misma y oprimir el boton aceptar.</p>
            <br/>
            <p style="margin: 4px; font-size: 18px;">La informacion de la solicitud se muestra a continuacion</p>
            <p style="margin: 4px; font-size: 18px;">Razon social de la empresa: <span style="font-weight: bold; color: #0a1a41;">${bussinesName}</span></p>
            <p style="margin: 4px; font-size: 18px;">Nombre de usuario: <span style="font-weight: bold; color: #0a1a41;">${userName}</span></p>
            <p style="margin: 4px; font-size: 18px;">Correo de usuario: <span style="font-weight: bold; color: #0a1a41;">${userEmail}</span></p>
            <br/>
            <h2 style="margin: 4px;">Informacion del producto</h2>`

    for(let i = 0; i<Products.length;i++) {
        msgHtml += `
            <p>Folio: ${Products[i].ProductFolio}</p>
            <p style="margin-botton: 5px;">Cantidad: ${Products[i].Quantity}</p>
        `
    }

    msgHtml += `
            <div style="display: flex; gap: 5px; margin-top: 15px;">
                <a
                    href="${process.env.FRONTEND_URL}/request/${requestID}/accept"
                    style="text-decoration: none; text-transform: uppercase; border: none; background-color: #0a1a41; color: white; padding: 10px 15px; font-size: 16px; border-radius: 5px;"
                >
                    Aceptar solicitud
                </a>

                <a
                    href="${process.env.FRONTEND_URL}/request/${requestID}/cancel"
                    style="text-decoration: none; text-transform: uppercase; border: none; background-color: #FA3B12; color: white; padding: 10px 15px; font-size: 16px; border-radius: 5px;"
                >
                    Cancelar
                </a>
            </div>
        </div>`

    try {
        await transport.sendMail({
            from: "Mopal Grupo <cotizaciones@mopalgrupo.com>", 
            to: "ventas@mopalgrupo.com", 
            subject: "Se realizo una solicitud de un producto", 
            text: "Se realizo la solicitud de un cliente hacia un producto en nuestro inventario", 
            html: msgHtml
        });
    } catch (error) {
        console.log(error)
    }
}

export const quotationSend = async(datos) => {
    const { FullName, Email, Products, pdfBuffer } = datos;

    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    let msgHtml = `
        <div style="font-family: 'Roboto', sans-serif; padding: 15px 30px; border-radius: 5px;">
            <h2 style="margin: 4px;">Estimado ${FullName}, aqui se presenta a continuacion la informacion de la cotizacion</h2>
            <br/>
            <table style="width: 100%; border-spacing: 0; font-size: 15px; margin-top: 15px;">
                <thead style="background-color: #3f3f3f; color: white;">
                    <tr>
                        <th style="text-align: start; padding: 0.3em;">Cant.</th>
                        <th style="text-align: start; padding: 0.3em;">Unid.</th>
                        <th style="text-align: start; padding: 0.3em;">Clave</th>
                        <th style="text-align: start; padding: 0.3em;">Valor Unit.</th>
                        <th style="text-align: start; padding: 0.3em;">Importe</th>
                    </tr>
                </thead>

                <tbody>
    `

    for(let i = 0; i<Products?.length;i++) {
        msgHtml += `
            <tr>
                <td style="vertical-align: top; padding: 0.3em; text-align: start;">${Products[i].Quantity}</td>
                <td style="vertical-align: top; padding: 0.3em; text-align: start;">Pieza</td>
                <td style="vertical-align: top; padding: 0.3em; text-align: start;">${Products[i].ProductFolio}</td>
                <td style="vertical-align: top; padding: 0.3em; text-align: start;">${formatearDinero(+Products[i].PricePerUnit)}</td>
                <td style="vertical-align: top; padding: 0.3em; text-align: start;">${formatearDinero(+Products[i].PricePerUnit * +Products[i].Quantity)}</td>
            </tr>
        `
    }

    msgHtml += `
                </tbody>
            </table>

            <div style="display: flex; gap: 5px; margin-top: 15px;">
                <p style="margin: 4px; font-size: 18px;">
                    En caso de necesitar informacion, por favor comuniquese con nosotros a travez de esta liga: 
                    <a 
                        href="${process.env.FRONTEND_URL}/contacto" 
                        style="text-decoration: none; text-transform: uppercase; border: none; font-size: 16px; border-radius: 5px;"
                    >Aqui</a>
                </p>
            </div>
        </div>
    `

    try {
        await transport.sendMail({
            from: "Mopal Grupo <solicitudes@mopalgrupo.com>", 
            to: Email, 
            subject: "Informacion de su cotizacion", 
            text: "Se envia la informacion de su cotizacion y su pdf", 
            attachments: [
                {
                    filename: 'cotizacion.pdf', 
                    content: pdfBuffer
                }
            ],
            html: msgHtml, 
        });
    } catch (error) {
        console.log("Aqui" + error)
    }
}

export const requestAcepted = async(datos) => {
    const { FullName, Email, Products } = datos;

    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    let msgHtml = `
        <div style="font-family: 'Roboto', sans-serif; padding: 15px 30px; border-radius: 5px;">
            <h2 style="margin: 4px;">Estimado ${FullName}, su solicitud ha sido <span style="color: #508FEB; text-transform: uppercase;">aceptada</span></h2>
            <br/>
            <p style="margin: 4px; font-size: 18px;">Se ha realizado con exito la solicitud, a continuacion de presenta la informacion de la misma</p>
            <table style="width: 100%; border-spacing: 0; font-size: 15px; margin-top: 15px;">
                <thead style="background-color: #3f3f3f; color: white;">
                    <tr>
                        <th style="text-align: start; padding: 0.3em;">Cant.</th>
                        <th style="text-align: start; padding: 0.3em;">Unid.</th>
                        <th style="text-align: start; padding: 0.3em;">Clave</th>
                        <th style="text-align: start; padding: 0.3em;">Valor Unit.</th>
                        <th style="text-align: start; padding: 0.3em;">Importe</th>
                    </tr>
                </thead>

                <tbody>
    `

    for(let i = 0; i<Products.length;i++) {
        msgHtml += `
            <tr>
                <td style="vertical-align: top; padding: 0.3em; text-align: start;">${Products[i].Quantity}</td>
                <td style="vertical-align: top; padding: 0.3em; text-align: start;">Pieza</td>
                <td style="vertical-align: top; padding: 0.3em; text-align: start;">${Products[i].ProductFolio}</td>
                <td style="vertical-align: top; padding: 0.3em; text-align: start;">${formatearDinero(+Products[i].PricePerUnit)}</td>
                <td style="vertical-align: top; padding: 0.3em; text-align: start;">${formatearDinero(+Products[i].PricePerUnit * +Products[i].Quantity)}</td>
            </tr>
        `
    }

    msgHtml += `
                </tbody>
            </table>

            <div style="display: flex; gap: 5px; margin-top: 15px;">
                <p style="margin: 4px; font-size: 18px;">
                    En caso de necesitar informacion, por favor comuniquese con nosotros a travez de esta liga: 
                    <a 
                        href="${process.env.FRONTEND_URL}/contacto" 
                        style="text-decoration: none; text-transform: uppercase; border: none; font-size: 16px; border-radius: 5px;"
                    >Aqui</a>
                </p>
            </div>
        </div>
    `

    try {
        await transport.sendMail({
            from: "Mopal Grupo <solicitudes@mopalgrupo.com>", 
            to: Email, 
            subject: "Se ha aceptado su solicitud", 
            text: "Se ha aceptado con exito la solicitud de su producto", 
            html: msgHtml
        });
    } catch (error) {
        console.log(error)
    }
}

export const requestCanceled = async(datos) => {
    const { FullName, Email, productFolio, quantity } = datos;

    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const msgHtml = `
        <div style="font-family: 'Roboto', sans-serif; background-color: #f5f5f5; padding: 15px 30px; border-radius: 5px;">
            <h2 style="margin: 4px;">Hola ${FullName}, su solicitud ha sido <span style="color: #FA3B12; text-transform: uppercase;">denegada</span></h2>
            <br/>
            <p style="margin: 4px; font-size: 18px;">Se ha realizado con exito la solicitus, a continuacion de presenta la informacion de la misma</p>
            <p style="margin: 4px; font-size: 18px;">Folio del producto: <span style="font-weight: bold; color: #0a1a41;">${productFolio}</span></p>
            <p style="margin: 4px; font-size: 18px;">Cantidad solicitada: <span style="font-weight: bold; color: #0a1a41;">${quantity}</span></p>

            <div style="display: flex; gap: 5px; margin-top: 15px;">
                <p style="margin: 4px; font-size: 18px;">
                    En caso de necesitar informacion, por favor comuniquese con nosotros a travez de esta liga: 
                    <a 
                        href="${process.env.FRONTEND_URL}/contacto" 
                        style="text-decoration: none; text-transform: uppercase; border: none; font-size: 16px; border-radius: 5px;"
                    >Aqui</a>
                </p>
            </div>
        </div>
    `

    try {
        await transport.sendMail({
            from: "Mopal Grupo <cotizaciones@mopalgrupo.com>", 
            to: Email, 
            subject: "Se ha denegado su solicitud", 
            text: "Se ha denegado con exito la solicitud de su producto", 
            html: msgHtml
        });
    } catch (error) {
        console.log(error)
    }
    
}

export const sendEmailToSystem = async(datos) => {
    const { bussinessName, detalles, email, folio, lastName, motivo, name, quantity } = datos;

    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    let msgHtml = `
        <div style="font-family: 'Roboto', sans-serif; background-color: #f5f5f5; padding: 15px 30px; border-radius: 5px;">
            <h2 style="margin: 4px;">Solicitud de ${motivo}</h2>
            <p style="margin: 4px; font-size: 18px;">Se realizo una solicitud para ${motivo}</p>
            <br/>
            <p style="margin: 4px; font-size: 18px;">La informacion de la solicitud se muestra a continuacion</p>
            <p style="margin: 4px; font-size: 18px;">Empresa: <span style="font-weight: bold; color: #0a1a41;">${bussinessName}</span></p>
            <p style="margin: 4px; font-size: 18px;">Nombre de usuario: <span style="font-weight: bold; color: #0a1a41;">${name + " " + lastName}</span></p>
            <p style="margin: 4px; font-size: 18px;">Correo de usuario: <span style="font-weight: bold; color: #0a1a41;">${email}</span></p>
            <br/>
    `

    if(folio !== "" && quantity > 0) {
        msgHtml += `
            <h2 style="margin: 4px;">Informacion del producto de interes</h2>
            <p style="margin: 4px; font-size: 18px;">Folio del producto: <span style="font-weight: bold; color: #0a1a41;">${folio}</span></p>
            <p style="margin: 4px; font-size: 18px;">Cantidad solicitada: <span style="font-weight: bold; color: #0a1a41;">${quantity}</span></p>
        `
    }

    msgHtml += `
            <p style="margin: 4px; font-size: 18px;">Mensaje: <span style="font-weight: bold; color: #0a1a41;">${detalles}</span></p>
        </div>
    `

    await transport.sendMail({
        from: email, 
        to: "cotizaciones@mopalgrupo.com", 
        subject: "Se realizo una solicitud " + motivo, 
        text: "Se realizo la solicitud de un cliente por el motivo: " + motivo, 
        html: msgHtml
    });
}