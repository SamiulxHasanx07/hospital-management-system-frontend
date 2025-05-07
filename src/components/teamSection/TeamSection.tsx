import React from 'react';
import TeamMember from '../teamMember/TeamMember';

const TeamSection: React.FC = () => {

    const teamMembers = [
        {
            name: "Md. Samiul Hasan",
            id: "42240101227",
            isLeader: true,
            image: "/images/team-members/samiul.jpg"
        },
        {
            name: "Akib Rayhan",
            id: "42240101218",
            isLeader: false,
            image: "/images/team-members/akib.jpg"
        },
        {
            name: "Salman Al Yasa",
            id: "42240101239",
            isLeader: false,
            image: "/images/team-members/salman.jpg"
        },
        {
            name: "Ariful Islam",
            id: "42240101234",
            isLeader: false,
            image: "/images/team-members/arif.jpg"
        }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Team Members</h2>
                <div className="w-24 h-1 bg-blue-500 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {teamMembers.map((member, index) => (
                    <TeamMember
                        key={index}
                        name={member.name}
                        id={member.id}
                        isLeader={member.isLeader}
                        image={member.image}
                    />
                ))}
            </div>
        </div>
    );
};

export default TeamSection;