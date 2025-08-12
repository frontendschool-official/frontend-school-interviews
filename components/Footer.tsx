import React from 'react';
import Link from 'next/link';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className='bg-secondary border-t border-border py-8 mt-auto'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {/* Company Info */}
          <div>
            <h3 className='text-lg font-semibold text-primary mb-4'>
              Frontend School Interviews
            </h3>
            <p className='text-text/80 text-sm leading-relaxed'>
              Master frontend development through hands-on coding challenges,
              system design exercises, and real-world interview simulations.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className='text-lg font-semibold text-primary mb-4'>
              Quick Links
            </h3>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/problems'
                  className='text-text/80 hover:text-primary transition-colors'
                >
                  Practice Problems
                </Link>
              </li>
              <li>
                <Link
                  href='/mock-interviews'
                  className='text-text/80 hover:text-primary transition-colors'
                >
                  Mock Interviews
                </Link>
              </li>
              <li>
                <Link
                  href='/roadmap'
                  className='text-text/80 hover:text-primary transition-colors'
                >
                  Learning Roadmap
                </Link>
              </li>
              <li>
                <Link
                  href='/about'
                  className='text-text/80 hover:text-primary transition-colors'
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className='text-lg font-semibold text-primary mb-4'>
              Connect With Us
            </h3>
            <div className='flex space-x-4'>
              <a
                href='https://github.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-text/80 hover:text-primary transition-colors'
              >
                <FaGithub className='text-xl' />
              </a>
              <a
                href='https://twitter.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-text/80 hover:text-primary transition-colors'
              >
                <FaTwitter className='text-xl' />
              </a>
              <a
                href='https://linkedin.com'
                target='_blank'
                rel='noopener noreferrer'
                className='text-text/80 hover:text-primary transition-colors'
              >
                <FaLinkedin className='text-xl' />
              </a>
            </div>
          </div>
        </div>

        <div className='border-t border-border mt-8 pt-8 text-center'>
          <p className='text-text/60 text-sm'>
            © 2024 Frontend School Interviews. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
