# Nahara AI

Una aplicación web moderna de chat impulsada por inteligencia artificial, construida con Next.js, React y TailwindCSS, que utiliza la API de Gemini para respuestas inteligentes y conversacionales.

---

## 🚀 Descripción

**Nahara AI** es una plataforma web que permite a los usuarios interactuar con una IA avanzada (Gemini de Google) en tiempo real. Ofrece una experiencia de usuario fluida, soporte para temas claros/oscuro, selección de modelo y una interfaz responsiva y moderna.

---

## 🛠️ Tecnologías principales

- **Next.js** 15 (App Router)
- **React** 19
- **TypeScript**
- **TailwindCSS** 3
- **Framer Motion** (animaciones)
- **Radix UI** (componentes accesibles)
- **Gemini API** (IA conversacional de Google)

---


## ⚙️ Instalación y configuración

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/MikeDevQH/NaharaAI.git
   cd chat-ia
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   # o
   pnpm install
   ```

3. **Configura las variables de entorno:**
   - Crea un archivo `.env.local` en la raíz:
     ```env
     GEMINI_API_KEY=tu_clave_de_api_de_gemini
     ```
   - Obtén tu API Key de Gemini en [Google AI Studio](https://aistudio.google.com/app/apikey)

4. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   # o
   pnpm dev
   ```
   Accede a [http://localhost:3000](http://localhost:3000)

---

## 🧑‍💻 Uso y desarrollo

- Edita la UI en `app/page.tsx` y los componentes en `components/`.
- El endpoint principal para la IA está en `app/api/chat/route.ts`.
- Cambia el modelo Gemini o parámetros en `lib/ai-config.ts`.
- Usa los contextos (`contexts/`) para gestionar tema y modelo globalmente.
- Los estilos globales y utilidades están en `styles/` y `tailwind.config.ts`.

---

## 🌐 Despliegue

Puedes desplegar fácilmente en plataformas como **Vercel**, **Netlify** o tu propio servidor:

1. **Build de producción:**
   ```bash
   npm run build
   npm run start
   ```
2. **Variables de entorno:** Asegúrate de definir `GEMINI_API_KEY` en el entorno de producción.
3. **Configuración avanzada:** Consulta `next.config.mjs` para personalizaciones.

---

## 🔒 Seguridad

- **Nunca compartas tu `.env.local` ni tu API Key de Gemini.**
- El endpoint de chat valida los mensajes y protege contra entradas inválidas.

---

## 📚 Recursos y enlaces útiles

- [Next.js Docs](https://nextjs.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Gemini API Docs](https://ai.google.dev/docs)
- [Radix UI](https://www.radix-ui.com/)

---



**¡Contribuciones, sugerencias y mejoras son bienvenidas!**
