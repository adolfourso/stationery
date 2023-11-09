<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Asegúrate de tener PHPMailer instalado y requerido correctamente

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $destinatario = $_POST['destinatario'];
    $asunto = $_POST['asunto'];
    $mensaje = $_POST['mensaje'];

    // Verificar si se ha subido un archivo CSV
    if ($_FILES['archivo']['error'] == UPLOAD_ERR_OK && $_FILES['archivo']['type'] == 'text/csv') {
        $archivoAdjunto = $_FILES['archivo']['tmp_name'];

        // Configurar PHPMailer
        $mail = new PHPMailer(true);

        try {
            $mail->isSMTP();
            $mail->Host = 'xxxxxxxxxx';
            $mail->SMTPAuth = true;
            $mail->Username = 'xxxxxx'; // Cambia por tu nombre de usuario
            $mail->Password = 'xxxxxxxx'; // Cambia por tu contraseña
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SSL;
            $mail->Port = 465;

            $mail->setFrom('info@delibreria.com.ar', 'Libreria');
            $mail->addAddress($destinatario);
            $mail->Subject = $asunto;
            $mail->Body = $mensaje;
            $mail->addAttachment($archivoAdjunto, 'archivo_adjunto.csv');

            $mail->send();
            echo 'Correo enviado correctamente';
        } catch (Exception $e) {
            echo "Error al enviar el correo: {$mail->ErrorInfo}";
        }
    } else {
        echo 'No se ha adjuntado un archivo CSV válido';
    }
} else {
    echo 'Acceso no autorizado';
}
?>
