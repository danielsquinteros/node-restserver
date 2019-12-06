// =================================
// Puerto
// =================================

process.env.PORT = process.env.PORT || 3000;



// =================================
// Vencimiento del Token
// =================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 dias
process.env.CADUCIDAD_TOKEN = 1000 * 60 * 24 * 30;




// =================================
// SEED de autenticación
// =================================
process.env.SEED = process.env.SEED || 'secret-desarrollo';


// =================================
// Entorno
// =================================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';






// =================================
// Base de datos
// =================================

let urlDB;

if (process.env.NODE_ENV === 'dev'){
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


// =================================
// Google Client ID
// =================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '933576229679-num9s0jpamfirlfccpthh9k9eb7j01ei.apps.googleusercontent.com';