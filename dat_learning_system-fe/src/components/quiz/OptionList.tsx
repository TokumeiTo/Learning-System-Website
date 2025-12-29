import { Button, Stack } from "@mui/material";

type Props = {
    options: { id: string; text: string }[];
    selectedOption?: string;
    correctOptionId?: string;
    isAnswered?: boolean; // whether to show feedback
    onSelect: (id: string) => void;
};

export default function OptionList({
    options,
    selectedOption,
    correctOptionId,
    isAnswered = false,
    onSelect,
}: Props) {
    return (
        <Stack spacing={1}>
            {options.map((opt) => {

                return (
                    <Button
                        key={opt.id}
                        variant="outlined"
                        fullWidth
                        onClick={() => onSelect(opt.id)}
                        disabled={isAnswered}
                        sx={{
                            backgroundColor:
                                isAnswered && opt.id === correctOptionId
                                    ? "lightGreen"
                                    : isAnswered && opt.id === selectedOption && opt.id !== correctOptionId
                                        ? "red"
                                        : undefined,
                          
                        }}
                    >
                        {opt.text}
                    </Button>

                );
            })}
        </Stack>
    );
}
