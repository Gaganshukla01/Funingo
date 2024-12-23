import React from 'react';
import { useEffect, useState } from "react";

import './styles.css';
import { bookNow, groupButtons, maskGroup, maskGroup2, mobileGroupButtons, mobileTextPackages, packageDiv, packageText, textofPackage } from '../../assets';

const Packages = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className=' text-center'>
      <section className='section1 relative flex justify-center items-center'>
        <img className='packageImg w-full max-sm:h-[180px]' src={packageDiv} alt="" />
        <img className=' absolute inset-0 m-auto max-sm:w-[50%]' src={packageText} alt="packageText" />
      </section>
      <section className='section2 flex flex-col justify-center items-center mt-[-50px] max-sm:mt-[0px] relative'>
        <div className='relative w-full'>
          <img className='w-full max-sm:h-[600px]' src={maskGroup} alt="" />
          <img className='max-sm:hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' src={textofPackage} alt="textofPackage" />
          <img className='lg:hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-sm:mt-[-20%] ' src={mobileTextPackages} alt="textofPackage" />
        </div>
        <div className='relative w-full mt-[-20%] max-sm:mt-[-300px]'>
          <img className='w-full max-sm:h-[1200px]' src={maskGroup2} alt="" />
        </div>
        <div className='absolute top-2/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%]'>
          <img className='max-sm:hidden' src={groupButtons} alt="groupButtons" />
          <img className='lg:hidden' src={mobileGroupButtons} alt="" />
        </div>
        <div className=' absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
          <a href="/book">
            <img src={bookNow} alt="" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default Packages;



