<?php
/**
 * Configuración del panel de administración.
 * IMPORTANTE: Cambiar la contraseña después del primer inicio de sesión.
 *
 * Para cambiar la contraseña, reemplazá el valor de 'password' y
 * poné 'hashed' en false. El sistema la hasheará automáticamente
 * al primer login y actualizará este archivo.
 */
return [
    'users' => [
        [
            'username' => 'admin',
            'name'     => 'Administrador',
            'password' => 'rgp2026admin',   // ← CAMBIÁ ESTO
            'hashed'   => false,            // ← se pondrá true automáticamente
            'role'     => 'admin',
        ],
    ],
    'session_lifetime' => 28800,  // 8 horas en segundos
];
