import { useState } from "react";
import { score } from "../../models/get/IGetMatch";
import { Button, Grid, TextField } from "@mui/material";

interface ScoreSetsProps {
    score: score[];
    onChange: (newScore: score[]) => void;
}

const ScoreSets: React.FC<ScoreSetsProps> = ({ score, onChange }) => {
    const [sets, setSets] = useState<score[]>(score);

    const handleScoreChange = (index: number, field: keyof score, value: string | number) => {
        const newSets = [...sets];
        newSets[index] = {
            ...newSets[index],
            [field]: value,
        };
        setSets(newSets);
        onChange(newSets);
    };

    const addSet = () => {
        setSets([
            ...sets,
            {
                player1Id: '',
                player1Score: 0,
                player2Id: '',
                player2Score: 0,
            }
        ]);
    };

    return (
        <>
            {sets.map((set, index) => (
                <Grid container spacing={2} key={index}>
                    <Grid item xs={6}>
                        <TextField
                            label={`Player 1 Score (Set ${index + 1})`}
                            type="number"
                            value={set.player1Score}
                            onChange={(e) => handleScoreChange(index, 'player1Score', parseInt(e.target.value, 10))}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label={`Player 2 Score (Set ${index + 1})`}
                            type="number"
                            value={set.player2Score}
                            onChange={(e) => handleScoreChange(index, 'player2Score', parseInt(e.target.value, 10))}
                            fullWidth
                            required
                        />
                    </Grid>
                </Grid>
            ))}
            <Button variant="outlined" onClick={addSet}>
                Add Set
            </Button>
        </>
    );
};

export default ScoreSets;