import { Card, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import OptionList from "./OptionList";

type Props = {
  question: { id: string; question: string; options: { id: string; text: string }[]; correctOptionId: string };
  selectedOption?: string;
  onAnswer: (selected: string) => void; // callback when user clicks
  onNext: () => void; // move to next question after delay
};

export default function QuestionCard({ question, selectedOption, onAnswer, onNext }: Props) {
  const [answered, setAnswered] = useState(false);

  const handleSelect = (id: string) => {
    onAnswer(id);
    setAnswered(true);
  };

 
  useEffect(() => {
    if (answered) {
      const timer = setTimeout(() => {
        setAnswered(false); // reset for next question
        onNext();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [answered, onNext]);

  return (
    <Card elevation={5} sx={{ p: 3, mt: 2 }}>
      <Typography variant="subtitle1">{question.question}</Typography>
      <OptionList
        options={question.options}
        selectedOption={selectedOption}
        correctOptionId={question.correctOptionId}
        isAnswered={answered}
        onSelect={handleSelect}
      />
    </Card>
  );
}
