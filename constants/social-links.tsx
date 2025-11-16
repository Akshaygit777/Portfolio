import { FaDiscord, FaGithub } from 'react-icons/fa';
import { FaLinkedin, FaMedium} from 'react-icons/fa6';
import { SiGmail } from 'react-icons/si';


export const socialLinks = [
    { target: '_blank', name: 'github', url: 'https://github.com/Akshaygit777', icon: <FaGithub className='size-full' /> },
    { target: '_blank', name: 'discord', url: 'https://discordapp.com/users/937607475425861662', icon: <FaDiscord className='size-full' /> },
    { target: '_blank', name: 'linkedin', url: 'https://www.linkedin.com/in/akshay-shukla-3a7b1822b?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app', icon: <FaLinkedin className='size-full' /> },
    { target: '_blank', name: 'email', url: 'mailto:connectingwithakshay@gmail.com', icon: <SiGmail className='size-full' /> },
];