import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, ChevronsRight, Linkedin, DollarSign, TrendingUp, User } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

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

const cardVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const ApplicantCard = ({ applicant, onReview, direction }) => {
  const [showDetails, setShowDetails] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-30, 30]);
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);

  const background = useTransform(
    x,
    [-300, -150, 0, 150, 300],
    [
      'linear-gradient(135deg, #ff5f6d 0%, #ffc371 100%)',
      'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    ]
  );

  const handleDragEnd = () => {
    const xValue = x.get();
    if (xValue > 100) onReview('approve');
    else if (xValue < -100) onReview('reject');
    x.set(0);
  };

  return (
    <motion.div
      className="w-full h-full absolute cursor-grab active:cursor-grabbing"
      variants={cardVariants}
      custom={direction}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
      style={{ x, rotate, opacity }}
      whileTap={{ cursor: 'grabbing' }}
      onPanStart={(_, info) => {
        x.set(info.point.x);
      }}
      onPan={(_, info) => {
        x.set(info.point.x);
      }}
      onPanEnd={handleDragEnd}
    >
      <motion.div className="w-full h-full absolute top-0 left-0 rounded-2xl" style={{ background }} />
      <Card className="w-full h-full overflow-hidden shadow-lg relative bg-white bg-opacity-90">
        <CardHeader className="text-2xl font-bold flex justify-between items-center p-6">
          <span>{applicant.name}</span>
          <a href={`https://${applicant.linkedin}`} target="_blank" rel="noopener noreferrer">
            <Linkedin className="h-6 w-6 text-blue-600" />
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
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 text-base overflow-hidden"
              >
                <p className="flex items-center"><User className="mr-3 h-5 w-5" /> {applicant.bio}</p>
                <p className="flex items-center"><TrendingUp className="mr-3 h-5 w-5" /> {applicant.traction}</p>
                <p className="flex items-center"><DollarSign className="mr-3 h-5 w-5" /> {applicant.ask}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
        <CardFooter className="justify-between p-6 absolute bottom-0 left-0 right-0 bg-white bg-opacity-75">
          <Button onClick={() => onReview('reject')} variant="outline" className="flex items-center text-lg">
            <ThumbsDown className="mr-2 h-5 w-5" /> Pass
          </Button>
          <Button onClick={() => onReview('skip')} variant="outline" className="flex items-center text-lg">
            <ChevronsRight className="mr-2 h-5 w-5" /> Maybe
          </Button>
          <Button onClick={() => onReview('approve')} variant="outline" className="flex items-center text-lg">
            <ThumbsUp className="mr-2 h-5 w-5" /> Interested
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const VCApplicantReviewApp = () => {
  const [applicants, setApplicants] = useState(mockApplicants);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [reviewed, setReviewed] = useState({ approved: [], rejected: [], skipped: [] });

  const handleReview = (action) => {
    const currentApplicant = applicants[currentIndex];
    setReviewed(prev => ({
      ...prev,
      [action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'skipped']: 
        [...prev[action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'skipped'], currentApplicant]
    }));
    setDirection(action === 'approve' ? -1 : 1);
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
        <AnimatePresence initial={false} custom={direction}>
          <ApplicantCard 
            key={currentIndex}
            applicant={applicants[currentIndex]} 
            onReview={handleReview}
            direction={direction}
          />
        </AnimatePresence>
      </div>
      <div className="mt-6 text-center text-lg text-gray-500">
        {currentIndex + 1} of {applicants.length}
      </div>
    </div>
  );
};

export default VCApplicantReviewApp;