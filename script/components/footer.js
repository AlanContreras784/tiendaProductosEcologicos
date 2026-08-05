// ======================================================
// footer.js
// Componente reutilizable del pie de página.
//
// Responsabilidades:
// - Renderizar el footer.
// - Evitar duplicar HTML en todas las páginas.
// ======================================================

const footer = document.getElementById("footer-principal");

if (footer) {
    footer.innerHTML = `
        <div class="col">
            <h4>Contacto</h4>
            <p>
                <strong>Dirección:</strong>
                Av. Siempreviva 742, Ciudad Autónoma de Buenos Aires
            </p>
            <p>
                <strong>Teléfono:</strong>
                +54 11 1234 5678
            </p>
            <p>
                <strong>Horario:</strong>
                9:00 - 18:00, Lunes a Viernes
            </p>
            <div class="follow">
                <h4>Seguinos</h4>
                <div class="icon">
                    <i class="fab fa-facebook-f"></i>
                    <i class="fab fa-twitter"></i>
                    <i class="fab fa-instagram"></i>
                    <i class="fab fa-pinterest-p"></i>
                    <i class="fab fa-youtube"></i>
                </div>
            </div>
        </div>
        <div class="col">
            <h4>Mi Cuenta</h4>
            <a href="login.html">Iniciar Sesión</a>
            <a href="carrito.html">Ver Carrito</a>
            <a href="#">Mis Favoritos</a>
            <a href="#">Seguimiento de Pedido</a>
            <a href="#">Ayuda</a>
        </div>
        <div class="col install">
            <h4>Descargá la App</h4>
            <p>Desde App Store o Google Play</p>
            <div class="row">
                <img src="../img/pay/app.jpg" alt="App Store">
                <img src="../img/pay/play.jpg" alt="Google Play">
            </div>
            <p>Pasarelas de pago seguras</p>
            <img src="../img/pay/pay.png" alt="Métodos de Pago">
        </div>
        <div class="copyright">
            <p>
                © 2026, Alan Contreras | Talento Tech - Ecommerce
            </p>
        </div>
    `;
}