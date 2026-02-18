// src/types.d.ts (veya ana dizinde types.d.ts)

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Eğer SCSS kullanıyorsan bunu da ekleyebilirsin:
declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}