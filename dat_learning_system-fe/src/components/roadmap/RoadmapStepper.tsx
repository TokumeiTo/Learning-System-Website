import React from 'react';
import { Stepper, Step, StepLabel, StepContent, Box, Typography, Chip } from '@mui/material';
import type { RoadmapStep } from '../../types_interfaces/roadmap';
import RoadmapNodeItem from './RoadmapNodeItem';

interface StepperProps {
    steps: RoadmapStep[];
    activeStep: number;
    setActiveStep: (step: number) => void;
}

const RoadmapStepper: React.FC<StepperProps> = ({ steps, activeStep, setActiveStep }) => {
    return (
        <Stepper 
            activeStep={activeStep} 
            orientation="vertical" 
            connector={<Box sx={{ ml: '11px', borderLeft: '2px dashed #cbd5e1', height: '100%', my: 1 }} />}
        >
            {steps.map((step, index) => (
                <Step key={step.id}>
                    <StepLabel 
                        optional={
                            <Chip 
                                label={step.nodeType} 
                                size="small" 
                                variant="outlined" 
                                sx={{ ml: 1, fontSize: '10px', height: '18px', fontWeight: 800, textTransform: 'uppercase' }} 
                            />
                        }
                    >
                        <Typography variant="subtitle1" fontWeight={800} color={activeStep === index ? 'primary' : 'text.primary'}>
                            {step.title}
                        </Typography>
                    </StepLabel>
                    <StepContent>
                        <RoadmapNodeItem 
                            step={step} 
                            onComplete={() => setActiveStep(index + 1)} 
                        />
                    </StepContent>
                </Step>
            ))}
        </Stepper>
    );
};

export default RoadmapStepper;