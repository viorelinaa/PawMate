// src/design-system/index.ts
// Import unic pentru toate componentele și token-urile design system-ului

// Token-uri
export * from './tokens';

// Componente
export { Button }      from './components/Button';
export { Badge }       from './components/Badge';
export { Card }        from './components/Card';
export { Input }       from './components/Input';
export { Select }      from './components/Select';
export { Hero }        from './components/Hero';
export { PageLayout }  from './components/PageLayout';

// Tipuri
export type { ButtonProps }   from './components/Button';
export type { BadgeProps }    from './components/Badge';
export type { CardProps }     from './components/Card';
export type { InputProps }    from './components/Input';
export type { SelectProps, SelectOption } from './components/Select';
export type { HeroProps }     from './components/Hero';
export type { PageLayoutProps } from './components/PageLayout';