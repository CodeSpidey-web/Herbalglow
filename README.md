# Herbal Glow — Premium Static Website

A handcrafted luxury D2C herbal beauty website built with HTML5, CSS3, and vanilla JavaScript.

## Structure

```txt
index.html
css/
  style.css
js/
  main.js
images/
  product and ingredient SVG placeholders
assets/
fonts/
```

## WhatsApp setup

Open `js/main.js` and replace:

```js
const WHATSAPP_NUMBER = '919999999999';
```

Use country code + number only. Example for India:

```js
const WHATSAPP_NUMBER = '919876543210';
```

All product Buy Now buttons, hero CTAs, contact actions, footer product links, and floating WhatsApp button use this number.

## External libraries

- GSAP + ScrollTrigger
- AOS
- Lenis Smooth Scroll
- Swiper.js
- Vanilla Tilt
- Google Fonts
- Font Awesome

## Notes

- Prices and payment gateway are intentionally omitted.
- Product and ingredient visuals are premium SVG placeholders and can be replaced in the `images/` folder without changing markup.
- Contact form submits by opening WhatsApp with the user’s form details pre-filled.
- Testimonials and transformation visuals are polished placeholder content until verified customer assets are available.
