import Image from 'next/image';
import React from 'react';

interface TeamMemberProps {
    name: string;
    id: string;
    isLeader?: boolean;
    image: string;
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, id, isLeader = false, image }) => {
    return (
        <div className="relative overflow-hidden bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group">
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-500 rotate-45 transform transition-all duration-300 group-hover:bg-blue-600"></div>

            {isLeader && (
                <div className="absolute top-2 right-2 z-10 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Team Leader
                </div>
            )}

            <div className="p-6 flex flex-col items-center">
                <Image
                    src={image}
                    width={150}
                    height={150}
                    alt='Team Member'
                    className='rounded-full mb-4'
                />

                <h3 className="text-xl font-bold text-gray-800 mb-1">{name}</h3>

                <div className="w-16 h-0.5 bg-blue-200 my-2"></div>

                <div className="bg-gray-100 px-4 py-2 rounded-full mt-2">
                    <p className="text-gray-600 font-mono">{id}</p>
                </div>
            </div>
        </div>
    );
};

export default TeamMember;