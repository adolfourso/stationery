const fs = require('fs');
const nodemailer = require('nodemailer');
const FileSaver = require('file-saver');

function guardarYEnviarArchivoPorCorreo(contenido, destinatario, asunto, mensaje) {
    // Guardar el archivo localmente
    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    FileSaver.saveAs(blob, 'lista de pedidos.txt');

    // Configurar el transporte de nodemailer
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: 'adolfourso@hotmail.com',
            pass: 'Rorty777'
        }
    });

    // Opciones del correo electrónico
    const mailOptions = {
        from: 'tu_direccion@gmail.com',
        to: destinatario,
        subject: asunto,
        text: mensaje,
        attachments: [
            {
                filename: 'archivo_adjunto.txt',
                path: 'archivo_adjunto.txt'
            }
        ]
    };

    // Enviar el correo electrónico
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error al enviar el correo electrónico:', error);
        } else {
            console.log('Correo enviado:', info.response);

            // Eliminar el archivo después de enviar el correo
            fs.unlinkSync('archivo_adjunto.txt');
        }
    });
}

// Ejemplo de uso
const contenidoArchivo = "Contenido del archivo adjunto";
const destinatario = "destinatario@example.com";
const asunto = "Asunto del Correo";
const mensaje = "Este es un mensaje de prueba";

guardarYEnviarArchivoPorCorreo(contenidoArchivo, destinatario, asunto, mensaje);
