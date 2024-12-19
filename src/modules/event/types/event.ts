export type EventType = [
  {
    userId: string;
    name: string;
    description: string;
    dateString: Date;
    address: EventAddress;
    guests?: Guest[];
    screens?: EventScreen[];
  },
];

export type EventScreen = {
  name: string;
  type: 'Home' | 'DressCode' | 'RSVP' | 'GiftList' | 'InsideEvent';
  fields:
    | HomePageFields
    | DressCodePageFields
    | GiftListPageFields
    | RSVPPageFields
    | InsideEventPageFields;
  index: number;
};

type HomePageFields = HomePageField[];

type HomePageField =
  | TextField
  | BannerField
  | PhotoSliderField
  | SocialMediaField;

type InsideEventPageFields = {
  scheduleList: ScheduleList[];
  table: Table;
  gallery: Gallery;
};

type RSVPPageFields = {
  title: string;
  description: string;
  separator?: boolean;
};

type DressCodePageFields = {
  title: string;
  dresscode: string;
  description: { women: string; men: string };
  separator?: boolean;
  divider?: boolean;
  photoListField?: PhotoListField;
};

type GiftListPageFields = {
  title: string;
  description: string;
  separator?: boolean;
  filter?: boolean;
  giftList: Gift[];
};

export type Guest = {
  name: string;
  age: number;
  email: string;
  rsvp: 'yes' | 'no' | 'rsvp';
};

type Gallery = {
  title: string;
  description: string;
  image: [{ url: string; alt: string; description: string }];
};

type Table = {
  title: string;
  description: string;
  tableNumber: number;
};

type ScheduleList = {
  time: string;
  event: string;
};

type Gift = {
  title: string;
  price: number;
  description: string;
  image: { url: string; alt: string };
};

type PhotoListField = {
  title: string;
  description: string;
  photoList: [{ url: string; alt: string; description?: string }];
  index: number;
  type: 'photo-list';
};

type TextField = {
  title: string;
  text: string[];
  separator: 'Diamond' | 'Triangle' | 'Circle';
  index: number;
  type: 'text';
};

type BannerField = {
  hostName: string;
  image: { url: string; alt: string; description?: string };
  index: number;
  type: 'banner';
};

type PhotoSliderField = {
  title: string;
  slider: [
    {
      name: string;
      image: { url: string; alt: string; description?: string };
    },
  ];
  index: number;
  type: 'photo-slider';
};

type SocialMediaField = {
  title: string;
  socialMedias: [
    {
      name: string;
      image: { url: string; alt: string; description?: string };
    },
  ];
  index: number;
  type: 'social-media';
};

export type EventAddress = {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  addressNumber: string;
};
