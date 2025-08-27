export interface Language {
  code: 'fr' | 'ar';
  name: string;
  direction: 'ltr' | 'rtl';
}

export interface TShirt {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  sizes: string[];
}

export interface Event {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
}

export interface NavItem {
  key: string;
  href: string;
}