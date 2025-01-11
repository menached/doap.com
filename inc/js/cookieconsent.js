<!-- head.php -->
<script>
  // Consent and cart handling script
  function setCartInSession(cartData) {
      sessionStorage.setItem("cartData", JSON.stringify(cartData));
      console.log("Cart stored in session storage:", cartData);
  }

  function setCartInCookies(cartData) {
      document.cookie = `cartData=${encodeURIComponent(JSON.stringify(cartData))}; path=/; SameSite=None; Secure; max-age=604800`; // 7 days
      console.log("Cart stored in cookies:", cartData);
  }

  function getCartData() {
      const cartFromCookie = getCookie("cartData");
      const cartFromSession = sessionStorage.getItem("cartData");
      if (cartFromCookie) {
          return JSON.parse(decodeURIComponent(cartFromCookie));
      } else if (cartFromSession) {
          return JSON.parse(cartFromSession);
      }
      return {};
  }

  function getCookie(name) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
  }

  window.addEventListener("load", function () {
      window.cookieconsent.initialise({
          palette: { popup: { background: "#000" }, button: { background: "#f1d600" } },
          type: "opt-in",
          content: {
              message: "We use cookies to improve your experience.",
              dismiss: "Got it!",
              allow: "Allow Cookies",
              deny: "Decline",
              link: "Learn more",
              href: "/privacy-policy"
          },
          onInitialise: function (status) {
              if (status === 'allow') {
                  const cartData = getCartData();
                  setCartInCookies(cartData);
              }
          },
          onStatusChange: function (status) {
              if (status === 'allow') {
                  const cartData = getCartData();
                  setCartInCookies(cartData);
              } else {
                  console.warn("Cookies declined. Keeping cart data in session storage.");
              }
          }
      });
  });
</script>

