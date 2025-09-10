# Pixi4Log

Pixi4Log is a modern, responsive blog front-end built with [Astro](https://astro.build/) and [Tailwind CSS](https://tailwindcss.com/). It features a tag-based navigation, code highlighting, and a clean UI for sharing posts about design, code, gaming, AI, and more.

## ✨ Features

- **Astro-powered static site** for fast performance
- **Tag navigation** with emoji icons and responsive "more" dropdown
- **Code blocks** with syntax highlighting and copy-to-clipboard button
- **Responsive design** using Tailwind CSS
- **Reusable components** for posts, tags, and layout

## 📁 Project Structure

```
src/
  components/    # UI components (Header, Footer, PostCard, Tag, TagList, MoreButton)
  layouts/       # Main layout
  pages/         # Site pages (index.astro)
  styles/        # Global styles (global.css)
  assets/        # SVGs and images
public/          # Static files (favicon)
.astro/          # Astro generated files
.vscode/         # Editor settings
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start development server:**
   ```sh
   npm run dev
   ```
   Visit [http://localhost:4321](http://localhost:4321) in your browser.

3. **Build for production:**
   ```sh
   npm run build
   ```

## 🧩 Customization

- **Tags:** Edit tag definitions in [`src/components/Header.astro`](src/components/Header.astro)
- **Posts:** Add or modify posts in [`src/pages/index.astro`](src/pages/index.astro)
- **Styling:** Update global styles in [`src/styles/global.css`](src/styles/global.css)

## 🛠️ Tech Stack

- [Astro](https://astro.build/)
- [React](https://react.dev/) (integrated)
- [Tailwind CSS](https://tailwindcss.com/)
- [PrismJS](https://prismjs.com/) (syntax highlighting)

## 📄 License

MIT

---

Made with ❤️ using Astro & Tailwind CSS.