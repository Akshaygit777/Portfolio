"use client";
import { socialLinks } from '@/constants/social-links';
import Link from 'next/link';
import { TbCopy, TbCopyCheck } from 'react-icons/tb';
import { useState } from 'react';

const SocialLinks = () => {
  const [copied, setCopied] = useState(false);
  const email = "connectingwithakshay@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email)
      .then(() => {
        setCopied(true);
        // Reset the copied state after 2 seconds
        setTimeout(() => {
          setCopied(false);
        }, 2000);
      })
      .catch((err) => {
        console.error('Failed to copy email: ', err);
      });
  };

  return (
    <div className="flex flex-row justify-center relative sm:grid sm:grid-cols-3 gap-1 h-full">
      <span className='hidden lg:flex cols-span-1 m-0 items-center justify-center md:px-1 lg:px-2 text-base sm:text-lg md:text-xl lg:text-2xl font-bold leading-none max-sm:hidden'>
        <h2>
          LIN<br />KS.
        </h2>
      </span>

      {socialLinks.map((link) => (
        <div
          key={link.name}
          className={`group flex-shrink flex items-center justify-center min-w-0 ${link.name === 'email' ? 'lg:hidden' : ''
            }`}
        >
          <Link
            target={link.target}
            className="rounded-xl flex items-center justify-center bg-background max-sm:bg-none border size-12 sm:size-14 md:size-10 lg:size-14"
            href={link.url}
          >
            <div className="size-full flex items-center justify-center p-1 rounded-xl">
              <div className="w-[80%] flex justify-center">
                {link.icon}
              </div>
            </div>
          </Link>
          <div className="hidden absolute w-16 left-0 -top-6 lg:-top-4 origin-right sm:flex max-sm:group-hover:hidden opacity-0 translate-y-5 group-hover:translate-y-0 group-hover:opacity-100 items-center justify-center bg-foreground text-background transition-all duration-500 ease-in-out font-bold rounded-md text-sm whitespace-nowrap z-50">
            {link.name}
          </div>
        </div>
      ))}

      <div
        onClick={handleCopyEmail}
        className='hidden col-span-3 h-full lg:flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors duration-300'
        role="button"
        tabIndex={0}
        aria-label="Click to copy email"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleCopyEmail();
          }
        }}
      >
        <div className="flex-1 min-w-0">
          <p className='font-SpaceGrotesk text-[0.65rem] truncate' title={email}>
            {email}
          </p>
        </div>
        <div className="flex-shrink-0">
          {copied ? (
            <TbCopyCheck className="text-green-400 transition-all duration-300 transform scale-110" />
          ) : (
            <TbCopy className="transition-all duration-300" />
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialLinks;