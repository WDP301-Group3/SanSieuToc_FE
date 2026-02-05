# 🔧 FIX: Tailwind CSS Setup

## ❌ Vấn đề
- CSS styles không được áp dụng
- Tailwind CSS v4 có cú pháp mới và chưa stable hoàn toàn
- Thiếu configuration files

## ✅ Giải pháp

### 1. Downgrade từ Tailwind v4 → v3.4.1
```bash
npm uninstall tailwindcss
npm install -D tailwindcss@^3.4.1 postcss autoprefixer
npx tailwindcss init -p
```

### 2. Cấu hình Tailwind Config (`tailwind.config.js`)
```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#00E536',
        secondary: '#166534',
        accent: '#FDE047',
        'background-light': '#F0FDF4',
        'background-dark': '#052e16',
        'surface-light': '#FFFFFF',
        'surface-dark': '#14532d',
      },
      fontFamily: {
        display: ['Montserrat', 'sans-serif'],
        body: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'neon': '0 0 10px rgba(0, 229, 54, 0.5)',
      },
    },
  },
  plugins: [],
}
```

### 3. Update CSS Syntax (`src/index.css`)
**Từ:**
```css
@import "tailwindcss";
```

**Thành:**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. PostCSS Config tự động được tạo
File `postcss.config.js` được tạo tự động khi chạy `npx tailwindcss init -p`

## 🎨 Design System được áp dụng

### Colors
- `bg-primary` → #00E536 (Bright Green)
- `bg-secondary` → #166534 (Dark Green)
- `bg-accent` → #FDE047 (Yellow/Gold)
- `bg-background-light` → #F0FDF4
- `bg-background-dark` → #052e16

### Custom Classes
- `.glass-effect` - Glass morphism
- `.logo-text-shadow` - Text shadow cho logo
- `.shadow-neon` - Neon glow effect

### Font Family
- `font-display` / `font-body` → Montserrat

## ✅ Kết quả
- ✅ Tailwind CSS hoạt động đúng
- ✅ Custom colors available
- ✅ Custom utilities working
- ✅ Dark mode support
- ✅ Responsive design ready

## 📝 Note
Tailwind v3 là phiên bản stable và được sử dụng rộng rãi. V4 vẫn đang trong giai đoạn phát triển và có nhiều breaking changes.
