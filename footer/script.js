export function renderFooter() {
  const footer = document.querySelector('footer');
  if (!footer) return;

  // Aplica de nuevo las clases que tú definas en CSS para fondo/padding
  footer.classList.add('footer', 'pt-1');

  footer.innerHTML = `
    <div class="container">
      <div class="row g-4">
          <div class="col-lg-4 col-md-6">
            <h3 class="footer-title">¡Conoce nuestras novedades!</h3>
            <p class="mb-4">
              Suscríbete a nuestro boletín para recibir actualizaciones, novedades y ofertas exclusivas.
            </p>
          </div>
            <div class="col-lg-4 col-md-6 ms-auto text-end">
              <form id="newsletter-form" class="mb-4">
                <div class="input-group">
                  <input
                    type="email"
                    class="form-control newsletter-input"
                    placeholder="Ingresa tu email"
                    required
                    title="Por favor escribe un email válido (p.e. usuario@dominio.com)"
                    >
                    <button class="btn btn-subscribe text-white" type="submit">Suscribete</button>
                  </div>
              </form>
                <p class="small">
                  Al suscribirse, acepta nuestra Política de privacidad y da su consentimiento para recibir actualizaciones.
                </p>
            </div>
            </div>
            <div class="footer-separator"></div>
            <div class="container">
                <div class="row g-4">
                    <div class="col-lg-5 col-md-6">
                        <h3 class="footer-title">¡Siguenos en nuestras redes!</h3>
                        <div class="social-links mb-4">
                            <a href="#"><img src="assets/icons8-facebook-192.png" alt="Facebook" width="32"></a>
                            <a href="#"><img src="assets/icons8-x-192.png" alt="Twitter" width="32"></a>
                            <a href="#"><img src="assets/icons8-instagram-192.png" alt="Instagram" width="32"></a>
                            <a href="#"><img src="assets/icons8-youtube-96.png" alt="YouTube" width="32"></a>
                            <a href="#"><img src="assets/icons8-tiktok-192.png" alt="YouTube" width="32"></a>
                        </div>
                        <ul class="footer-links"></ul>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <h3 class="footer-title">Sobre nosotros</h3>
                        <ul class="footer-links">
                            <li><a href="our-story.html">Nuestra dulce historia</a></li>
                            <li><a href="about.html">Quiénes somos</a></li>
                            <li><a href="products.html">Nuetros productos</a></li>
                        </ul>
                    </div>
                    <div class="col-lg-4 col-md-6">
                        <h3 class="footer-title">Soporte</h3>
                        <ul class="footer-links">
                            <li><a href="contac-us.html">¡Contactanos!</a></li>
                            <li><a href="https://www.fedex.com/es-mx/home.html" target="_blank">Localiza tu envio</a></li>
                            <li><a href="faq.html">FAQ</a></li>
                            <li><a href="help-center.html">Centro de ayuda</a></li>
                            <li><a href="privacy.html">Política de privacidad</a></li>
                            <li><a href="terms-conditions.html">Terminos de servicios</a></li>
                        </ul>
                    </div>
                </div>
            </div>
          </div>
          <div class="footer-bottom mt-5">
            <div class="container-fluid">
                <div class="row py-1">
                    <div class="col-md-6 text-center">
                        <p class="mb-0">&copy; 2025 ClickN'Sweet. Todos los derechos reservados.</p>
                    </div>
                    <div class="col-md-6 text-center">
                        <p class="mb-0">Designed by <a href="#">ClickN'Sweet</a></p>
                    </div>
        </div>
      </div>
    </div>
  `;
}
