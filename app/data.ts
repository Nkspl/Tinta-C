export type Artist = {
  id: string;
  name: string;
  handle: string;
  studio: string;
  city: string;
  distance: string;
  rating: number;
  reviews: number;
  styles: string[];
  nextSlot: string;
  priceFrom: number;
  verified: boolean;
  avatar: string;
  cover: string;
  work: string[];
  bio: string;
};

export const artists: Artist[] = [
  {
    id: "1",
    name: "Camila Reyes",
    handle: "@cami.ink",
    studio: "Casa Nómada",
    city: "Providencia",
    distance: "3,2 km",
    rating: 4.9,
    reviews: 128,
    styles: ["Fine line", "Botánico"],
    nextSlot: "Jue 18 jul",
    priceFrom: 65000,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=85",
    cover: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=1200&q=85",
    work: [
      "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?auto=format&fit=crop&w=900&q=85",
    ],
    bio: "Diseños delicados y piezas botánicas creadas a medida. Trabajo con cita previa y una conversación tranquila antes de cada sesión.",
  },
  {
    id: "2",
    name: "Matías Soto",
    handle: "@soto.black",
    studio: "Distrito Ink",
    city: "Santiago Centro",
    distance: "5,8 km",
    rating: 4.8,
    reviews: 94,
    styles: ["Blackwork", "Geométrico"],
    nextSlot: "Sáb 20 jul",
    priceFrom: 80000,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=85",
    cover: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=1200&q=85",
    work: [
      "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1775135981378-4e7c1767436d?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1542727365-19732a80dcfd?auto=format&fit=crop&w=900&q=85",
    ],
    bio: "Blackwork de alto contraste, geometría y proyectos de manga. Cada propuesta se adapta a la anatomía y al movimiento del cuerpo.",
  },
  {
    id: "3",
    name: "Antonia Silva",
    handle: "@antonia.color",
    studio: "Lumbre Tattoo",
    city: "Ñuñoa",
    distance: "7,1 km",
    rating: 5.0,
    reviews: 76,
    styles: ["Neo tradicional", "Color"],
    nextSlot: "Mar 23 jul",
    priceFrom: 95000,
    verified: true,
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=85",
    cover: "https://images.unsplash.com/photo-1775135981378-4e7c1767436d?auto=format&fit=crop&w=1200&q=85",
    work: [
      "https://images.unsplash.com/photo-1775135981378-4e7c1767436d?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=900&q=85",
    ],
    bio: "Ilustración vibrante, animales y personajes con una paleta propia. Me interesa transformar referencias personales en piezas únicas.",
  },
  {
    id: "4",
    name: "Diego Fuentes",
    handle: "@fuentes.realism",
    studio: "Taller Sur",
    city: "San Miguel",
    distance: "9,4 km",
    rating: 4.7,
    reviews: 61,
    styles: ["Realismo", "Black & grey"],
    nextSlot: "Vie 26 jul",
    priceFrom: 120000,
    verified: false,
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=85",
    cover: "https://images.unsplash.com/photo-1753259789341-808371092e19?auto=format&fit=crop&w=1200&q=85",
    work: [
      "https://images.unsplash.com/photo-1753259789341-808371092e19?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=900&q=85",
      "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?auto=format&fit=crop&w=900&q=85",
    ],
    bio: "Retratos y realismo en negro y gris. Las sesiones extensas se planifican por etapas para cuidar la piel y el resultado final.",
  },
];

export type Booking = {
  id: string;
  artistId: string;
  artist: string;
  studio: string;
  style: string;
  date: string;
  time: string;
  status: "Esperando anticipo" | "Confirmada" | "En revisión" | "Completada" | "Rechazada" | "Reembolsada";
  price: number;
  depositAmount?: number;
  paymentStatus?: string;
  checkoutUrl?: string | null;
  perspective?: "client" | "artist";
  client?: string;
  placement?: string;
  size?: string;
  notes?: string;
};

export type Conversation = {
  id: string;
  person: string;
  role: string;
  avatar: string;
  unread: number;
  messages: { id: string; from: "me" | "them"; text: string; time: string }[];
};

export type PortfolioItem = { id: string; title: string; style: string; image: string; likes: number };

export const portfolioSeed: PortfolioItem[] = [
  { id: "1", title: "Botánica en movimiento", style: "Fine line", image: artists[0].work[0], likes: 284 },
  { id: "2", title: "Serpiente ornamental", style: "Blackwork", image: artists[1].work[0], likes: 198 },
  { id: "3", title: "Memoria floral", style: "Botánico", image: artists[0].work[1], likes: 341 },
  { id: "4", title: "Geometría natural", style: "Geométrico", image: artists[2].work[0], likes: 156 },
  { id: "5", title: "Retrato de sombra", style: "Black & grey", image: artists[3].work[0], likes: 427 },
  { id: "6", title: "Línea continua", style: "Minimalista", image: artists[0].work[2], likes: 223 },
];

export const formatClp = (value: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
