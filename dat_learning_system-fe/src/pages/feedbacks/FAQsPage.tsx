import React, { useState } from 'react';
import {
    Box, Typography, Tab, Tabs, Accordion,
    AccordionSummary, AccordionDetails, Stack
} from '@mui/material';
import { ExpandMore, Quiz, BugReport as BugIcon } from '@mui/icons-material';
import PageLayout from '../../components/layout/PageLayout';
import BugReportForm from '../../components/feedback/BugReportForm';

const FAQ_DATA = [
    {
        q: "How do I access the IT Sandbox?",
        a: "You can find the IT Sandbox link under the 'IT' category in your Courses dashboard once you complete the AWS Essentials module."
    },
    {
        q: "Can I take the Japanese Keigo test twice?",
        a: "Yes. Corporate policy allows up to 3 attempts. Your highest score will be recorded in your Performance Report."
    },
    {
        q: "The E-Book viewer isn't loading on my mobile.",
        a: "The E-Book viewer requires a modern browser. Please ensure you are using the latest version of Chrome or Safari."
    }
];

const SupportCenter: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <PageLayout>
            <Box sx={{ minHeight: 'calc(100vh - 65px)', bgcolor: 'background.default', p: { xs: 2, md: 6 } }}>
                <Stack spacing={1} sx={{ mb: 4 }}>
                    <Typography variant="h3" fontWeight={900}>Support Center</Typography>
                    <Typography color="text.secondary">Everything you need to get back to learning.</Typography>
                </Stack>

                {/* Modern Tab Navigation */}
                <Tabs
                    value={activeTab}
                    onChange={(_, val) => setActiveTab(val)}
                    sx={{
                        mb: 4,
                        position: 'sticky',
                        top: '70px',
                        '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0' }
                    }}
                >
                    <Tab icon={<Quiz sx={{ mr: 1 }} />} iconPosition="start" label="FAQs" sx={{ fontWeight: 700 }} />
                    <Tab icon={<BugIcon sx={{ mr: 1 }} />} iconPosition="start" label="Report an Issue" sx={{ fontWeight: 700 }} />
                </Tabs>

                {activeTab === 0 ? (
                    <Box>
                        <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>Common Questions</Typography>
                        {FAQ_DATA.map((item, index) => (
                            <Accordion
                                key={index}
                                elevation={0}
                                sx={{
                                    mb: 2,
                                    borderRadius: '16px !important',
                                    border: '1px solid #e2e8f0',
                                    '&:before': { display: 'none' }
                                }}
                            >
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Typography fontWeight={700}>{item.q}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography color="text.secondary">{item.a}</Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                ) : (
                    <BugReportForm />
                )}
            </Box>
        </PageLayout>
    );
};

export default SupportCenter;