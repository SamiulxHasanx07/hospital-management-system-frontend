import Button from '@/components/button/Button';
import CoverPageHeader from '@/components/coverPageHeader/CoverPageHeader';
import TeamSection from '@/components/teamSection/TeamSection';
import Link from 'next/link';
import React from 'react';
import { HiOutlineArrowRight } from 'react-icons/hi';

const MainPage = () => {
  return (
    <div>
      <CoverPageHeader />
      <main className="flex-grow pb-8">
        <TeamSection />
        <div className='text-center'>
          <Link className='text-center hover:text-blue-800 underline' href="/signup">
            <Button>Get Started  <HiOutlineArrowRight size={22} /></Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default MainPage;