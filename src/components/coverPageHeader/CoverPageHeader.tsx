import React from 'react';

const CoverPageHeader: React.FC = () => {
    return (
        <div className="relative w-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 to-blue-800/90 z-10"></div>
            <img
                src="/images/hospital-image.jpeg"
                alt="Hospital Building"
                className="w-full h-[40vh] object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center z-20 px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight text-center mb-2">
                    Hospital Management System
                </h1>
                <div className='text-white font-bold text-2xl flex gap-8'>
                    <p>Software development II (CSE 2291)</p>
                </div>
                <div className='text-white font-bold text-2xl flex gap-8'>
                    <p>Semester: 4th</p>
                    <p>Section: A</p>
                </div>
            </div>
        </div>
    );
};

export default CoverPageHeader;