export interface MattressAsset {
  id: string;
  name: string;
  photo: string;
  crossSection: string;
  tagline: string;
}

export const MATTRESS_ASSETS: Record<string, MattressAsset> = {
  'pristine-euro-top': {
    id: 'pristine-euro-top',
    name: 'Pristine Euro Top',
    photo: '/Pristine Euro Top.jpg',
    crossSection: '/Pristine EuroTop 10 Jul 23.jpg',
    tagline: 'Pocketed Springs with 3" Natural Latex Euro Top'
  },
  'heavenly': {
    id: 'heavenly',
    name: 'Heavenly Luxury',
    photo: '/Heavenly.jpg',
    crossSection: '/Heavenly 10 Jul 23.jpg',
    tagline: 'Pocketed Spring Unit with Memory Foam & Natural Latex'
  },
  'supreme-bliss': {
    id: 'supreme-bliss',
    name: 'Supreme Bliss',
    photo: '/Supreme bliss.jpg',
    crossSection: '/Supreme Bliss 10 Jul 23.jpg',
    tagline: 'Pocketed Springs with Natural Latex & Bamboo Fabric'
  },
  'blossom': {
    id: 'blossom',
    name: 'Blossom Spring',
    photo: '/Blossom.jpg',
    crossSection: '/Blossom 10 Jul 23.jpg',
    tagline: 'Heavy-Duty Bonnell Spring with Coir & Foam Cushioning'
  },
  'royal-classic': {
    id: 'royal-classic',
    name: 'Royal Classic Coir',
    photo: '/Royal Classic.jpg',
    crossSection: '/Royal Classic 10 Jul 23.jpg',
    tagline: 'Dual Rubberised Coir Blocks with Latex Top'
  },
  'orthopaedic': {
    id: 'orthopaedic',
    name: 'Orthopaedic Coir',
    photo: '/Orthopedic.jpg',
    crossSection: '/Orthopaedic 10 Jul 23.jpg',
    tagline: 'High-Density Coir Block with 100% Raw Cotton Cover'
  },
  'orthopaedic-classic': {
    id: 'orthopaedic-classic',
    name: 'Orthopaedic Classic',
    photo: '/Orthopedic classic.jpg',
    crossSection: '/Orthopaedic Classic 10 Jul 23.jpg',
    tagline: 'Rubberised Coir with Perforated Natural Latex Top'
  },
  'comfy-gel': {
    id: 'comfy-gel',
    name: 'Comfy Gel Foam',
    photo: '/Comfy Gel.jpg',
    crossSection: '/Comfey Gel 11 Aug 26.jpg',
    tagline: 'Cooling Gel-Infused Visco Elastic Foam'
  },
  'zee': {
    id: 'zee',
    name: 'Zee Foam',
    photo: '/Zee.jpg',
    crossSection: '/Zee.jpg',
    tagline: 'Extra Thick Comfort Foam with Rebonded Base'
  },
  'plus-max': {
    id: 'plus-max',
    name: 'Plus Max Convoluted',
    photo: '/Plus Max.jpg',
    crossSection: '/Plus  Max 10 Jul 23.jpg',
    tagline: 'Convoluted Peak-and-Valley Aeration Foam'
  }
};

export const getMattressAsset = (id: string): MattressAsset => {
  return MATTRESS_ASSETS[id] || {
    id,
    name: 'Hayleys Mattress',
    photo: '/content.png',
    crossSection: '/content.png',
    tagline: 'Premium Sri Lankan Mattress'
  };
};
