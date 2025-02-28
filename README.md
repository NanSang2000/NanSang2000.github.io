# Personal Website

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/NanSang2000/NanSang2000.github.io/main.yml?style=flat-square)](https://github.com/NanSang2000/NanSang2000.github.io/actions)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Styled with Tailwind CSS](https://img.shields.io/badge/Styled%20with-Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

This is my personal website built with Next.js and Nextra documentation theme, integrating features such as blog posts, notes, code snippets, and project showcases.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Documentation Theme**: [Nextra](https://nextra.site/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: 
  - [Material Tailwind](https://material-tailwind.com/)
  - [Headless UI](https://headlessui.com/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **3D Effects**: [Three.js](https://threejs.org/), [Spline](https://spline.design/)

## 📋 Key Features

- **Blog System**: Share technical articles and personal insights
- **Notes Module**: Learning notes covering various technical fields including frontend and backend
- **Code Snippets**: Collection of commonly used code snippets and algorithm implementations
- **Project Showcase**: Portfolio of personal projects
- **Interactive Resume**: Online personal resume
- **Tech Stack Display**: Dynamic showcase of mastered technologies

## 📂 Project Structure

```
├── components/       # Custom components
├── data/            # Website data
├── pages/           # Page content
│   ├── api/         # API routes
│   ├── blog/        # Blog posts
│   ├── note/        # Technical notes
│   ├── CodeSnippets/ # Code snippets
│   └── projects/    # Project showcase
├── public/          # Static assets
├── styles/          # Global styles
├── utils/           # Utility functions
└── theme.config.tsx # Nextra theme configuration
```

## 🛠️ Installation and Running

1. Clone the repository

```bash
git clone https://github.com/NanSang2000/NanSang2000.github.io.git
cd NanSang2000.github.io
```

2. Install dependencies

```bash
pnpm install
```

3. Local development

```bash
pnpm dev
```

4. Build production version

```bash
pnpm build
pnpm start
```

## 📝 Content Updates

- Blog and note content is written in MDX format under the `pages/` directory
- Navigation structure is configured through `_meta.json` files
- Components can be developed and modified in the `components/` directory

## 📱 Responsive Design

The website features responsive design, adapting to desktop, tablet, and mobile devices.

## 🔗 Links

- [Visit Online](https://nansang2000.github.io)
- [GitHub Repository](https://github.com/NanSang2000/NanSang2000.github.io)

## 📄 License

[MIT](LICENSE)
