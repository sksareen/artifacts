import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from 'button';
import { Button } from 'ui/button';

const mockApplicants = [
  {
    id: 1,
    name: 'Jane Doe',
    company: 'TechInnovate',
    pitch: 'AI-powered supply chain optimization',
    bio: 'Serial entrepreneur with 10+ years in logistics tech',
    linkedin: 'linkedin.com/in/janedoe',
    traction: '$500K ARR, 20% MoM growth',
    ask: '$2M Seed round'
  },
  {
    id: 2,
    name: 'John Smith',
    company: 'GreenEnergy',
    pitch: 'Sustainable battery technology',
    bio: 'PhD in Material Science, 5 patents in energy storage',
    linkedin: 'linkedin.com/in/johnsmith',
    traction: '2 pilot projects with major automakers',
    ask: '$5M Series A'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'HealthTech',
    pitch: 'Wearable health monitoring devices',
    bio: 'Former Apple Health team lead, MD from Stanford',
    linkedin: 'linkedin.com/in/alicejohnson',
    traction: '50K active users, FDA approval pending',
    ask: '$3M Seed extension'
  },
];

const ApplicantCard = ({ applicant, onReview }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="w-full h-full absolute cursor-grab active:cursor-grabbing">
      <Card className="w-full h-full overflow-hidden shadow-lg relative bg-white bg-opacity-90">
        <CardHeader className="text-2xl font-bold flex justify-between items-center p-6">
          <span>{applicant.name}</span>
          <a href={`https://${applicant.linkedin}`} target="_blank" rel="noopener noreferrer">
            <svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.25c-.97 0-1.75-.78-1.75-1.75s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.75-1.75 1.75zm13.5 11.25h-3v-5.5c0-1.38-.56-2.5-2-2.5s-2 1.12-2 2.5v5.5h-3v-10h3v1.5c.44-.66 1.34-1.5 2.5-1.5 2.21 0 3.5 1.79 3.5 4v6z"/>
            </svg>
          </a>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <p className="font-semibold text-xl">{applicant.company}</p>
          <p className="text-gray-600 text-lg">{applicant.pitch}</p>
          <Button 
            variant="ghost" 
            className="text-base" 
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </Button>
          {showDetails && (
            <div className="space-y-3 text-base overflow-hidden">
              <p className="flex items-center"><span className="mr-3 h-5 w-5">👤</span> {applicant.bio}</p>
              <p className="flex items-center"><span className="mr-3 h-5 w-5">📈</span> {applicant.traction}</p>
              <p className="flex items-center"><span className="mr-3 h-5 w-5">💵</span> {applicant.ask}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-between p-6 absolute bottom-0 left-0 right-0 bg-white bg-opacity-75">
          <Button onClick={() => onReview('reject')} variant="outline" className="flex items-center text-lg">
            <span className="mr-2 h-5 w-5">👎</span> Pass
          </Button>
          <Button onClick={() => onReview('skip')} variant="outline" className="flex items-center text-lg">
            <span className="mr-2 h-5 w-5">➡️</span> Maybe
          </Button>
          <Button onClick={() => onReview('approve')} variant="outline" className="flex items-center text-lg">
            <span className="mr-2 h-5 w-5">👍</span> Interested
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

const VCApplicantReviewApp = () => {
  const [applicants, setApplicants] = useState(mockApplicants);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewed, setReviewed] = useState({ approved: [], rejected: [], skipped: [] });

  const handleReview = (action) => {
    const currentApplicant = applicants[currentIndex];
    setReviewed(prev => ({
      ...prev,
      [action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'skipped']: 
        [...prev[action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'skipped'], currentApplicant]
    }));
    setCurrentIndex(prevIndex => prevIndex + 1);
  };

  if (currentIndex >= applicants.length) {
    return (
      <div className="text-center p-8 h-screen flex flex-col justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <h2 className="text-3xl font-bold mb-6">Review Complete</h2>
        <div className="space-y-4 text-xl">
          <p>Interested: {reviewed.approved.length}</p>
          <p>Passed: {reviewed.rejected.length}</p>
          <p>Maybe: {reviewed.skipped.length}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-50">
      <h1 className="text-3xl font-bold mb-6 text-center">VC Applicant Review</h1>
      <div className="flex-grow relative">
        <ApplicantCard 
          key={currentIndex}
          applicant={applicants[currentIndex]} 
          onReview={handleReview}
        />
      </div>
      <div className="mt-6 text-center text-lg text-gray-500">
        {currentIndex + 1} of {applicants.length}
      </div>
    </div>
  );
};

export default VCApplicantReviewApp;