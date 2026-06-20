import { SiFacebook, SiLinkedin, SiTelegram, SiWhatsapp, SiX } from 'react-icons/si';

export const rankTiers = [
    {name:"STARTER", requiredCoins:0, theme: "starter"},
    {name:"PROMOTER", requiredCoins:0, theme: "promoter"},
    { name: 'GOLD', requiredCoins: 100, theme: 'gold' },
    { name: 'PLATINUM', requiredCoins: 300, theme: 'platinum' },
    // { name:"BRONZE",  requiredCoins: 500, theme: 'bronze' },
    // { name:"SILVER",  requiredCoins: 1000, theme: 'silver' }, 
  ];


  export  const socialSharePlatforms = [
    { key: 'whatsapp', label: 'WhatsApp', icon: <SiWhatsapp /> },
    { key: 'telegram', label: 'Telegram', icon: <SiTelegram /> },
    { key: 'facebook', label: 'Facebook', icon: <SiFacebook /> },
    { key: 'x', label: 'X', icon: <SiX /> },
    { key: 'linkedin', label: 'LinkedIn', icon: <SiLinkedin /> },
  ];