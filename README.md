# 🎮 Pokédex App

Una Pokédex moderna e interactiva construida con React, TypeScript y la [PokéAPI](https://pokeapi.co/). Explora, busca y descubre información detallada sobre todos los Pokémon.

![Pokédex Preview](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## ✨ Características

- 🔍 **Búsqueda en tiempo real** - Encuentra Pokémon por nombre instantáneamente
- 🎯 **Filtros avanzados** - Filtra por tipo y generación
- 📱 **Diseño responsive** - Funciona perfectamente en móvil, tablet y escritorio
- 🎨 **Vista de cuadrícula y lista** - Cambia entre diferentes modos de visualización
- 📊 **Información detallada** - Estadísticas, habilidades, movimientos y más
- 🌍 **Soporte multiidioma** - Traducciones al español
- 🔄 **Cadena evolutiva** - Visualiza la evolución completa de cada Pokémon
- ⚡ **Carga infinita** - Scroll infinito para explorar todos los Pokémon
- 💾 **Persistencia local** - Guarda tus preferencias de visualización
- 🎭 **Animaciones fluidas** - Transiciones suaves con Framer Motion

## 📋 Requisitos previos

- Node.js 16.x o superior
- npm o yarn

## 🛠️ Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/pokedex-app.git
cd pokedex-app
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

4. Abre tu navegador en `http://localhost:5173`

## 📦 Tecnologías

- **React 18** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático para JavaScript
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de CSS utility-first
- **Framer Motion** - Librería de animaciones
- **shadcn/ui** - Componentes de UI reutilizables
- **Lucide React** - Iconos modernos
- **PokéAPI** - API REST de Pokémon

## 🎮 Uso

### Búsqueda
Escribe el nombre de un Pokémon en la barra de búsqueda para encontrarlo instantáneamente.

### Filtros
- **Por tipo**: Selecciona uno o varios tipos (Fuego, Agua, Planta, etc.)
- **Por generación**: Filtra por generaciones específicas (I-IX)
- Los filtros se pueden combinar con la búsqueda

### Modos de vista
- **Cuadrícula**: Vista de tarjetas con imágenes grandes
- **Lista**: Vista compacta en formato lista

### Detalles
Haz clic en cualquier Pokémon para ver:
- Estadísticas base
- Tipos y habilidades
- Movimientos aprendidos
- Descripción de la especie
- Cadena evolutiva interactiva
- Información de captura

## 🌐 API

Este proyecto utiliza la [PokéAPI](https://pokeapi.co/), una API REST gratuita con información completa sobre Pokémon.

Endpoints principales utilizados:
- `GET /pokemon` - Lista de Pokémon
- `GET /pokemon/{id}` - Detalles de Pokémon específico
- `GET /pokemon-species/{id}` - Información de especie
- `GET /type/{type}` - Pokémon por tipo
- `GET /evolution-chain/{id}` - Cadena evolutiva

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Características futuras

- [ ] Favoritos y colección personal
- [ ] Comparador de Pokémon
- [ ] Filtro por habilidades
- [ ] Modo oscuro/claro
- [ ] Soporte offline (PWA)
- [ ] Compartir Pokémon en redes sociales
- [ ] Búsqueda por estadísticas
- [ ] Juego de adivinanzas

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [PokéAPI](https://pokeapi.co/) por la increíble API
- [The Pokémon Company](https://www.pokemon.com/) por los diseños originales
- [shadcn/ui](https://ui.shadcn.com/) por los componentes UI
- Comunidad de React y TypeScript

## 👨‍💻 Autor

**Gabriel Sánchez Heredia**  
- GitHub: [@gabiisnchez](https://github.com/gabiisnchez)
- Email: gabiisnchez@proton.me

---

⭐️ Si te gustó este proyecto, dale una estrella en GitHub!
