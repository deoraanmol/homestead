import { Text, Box, Button, Layer, NameValueList, NameValuePair, Select, FormField } from "grommet";
import { Close } from "grommet-icons";
import React, { Fragment, useState } from "react";

export const EvaluatePropertyLayer = ({ propertyId, onSubmit, onClose }) => {
    const [evaluationReport, setEvaluationReport] = useState([
        { "question": "Rate the property location?", "rating": 5 },
        { "question": "Rate the property size?", "rating": 5 },
        { "question": "Rate the property rental?", "rating": 5 },
    ]);
    const options = [1, 2, 3, 4, 5];
    const onChangeRating = (index, rating) => {
        const newEvaluation = evaluationReport.map((eachQuestion, idx) => {
            if (idx === index) {
                return { question: eachQuestion.question, rating };
            }
            return eachQuestion
        });
        setEvaluationReport(newEvaluation);
    }
    return (
        <Fragment>
            <Layer
                position="right"
                full="vertical"
                onEsc={onClose}
                onClickOutside={onClose}
            >
                <Box margin="medium">
                    <Box as="header" direction="row" align="center" elevation="none" justify="center">
                        <Text margin={{ left: 'small' }}>Answer Evaluation Questions (ID: {propertyId})</Text>
                        <Button onClick={onClose} style={{ boxShadow: "none" }}><Close /></Button>
                    </Box>
                    <Box flex overflow="auto" pad="small">
                        <Box flex="grow" overflow="auto" pad={{ vertical: 'medium' }}>
                            <Box>
                                {evaluationReport.map((eachReport, idx) =>
                                (<FormField label={eachReport.question}>
                                    <Select options={options} value={eachReport.rating}
                                        onChange={({ option }) => onChangeRating(idx, option)}
                                    />
                                </FormField>)
                                )}
                            </Box>
                        </Box>
                    </Box>
                    <Box flex={false} as="footer" align="center">
                        <Button type="submit" onClick={() => onSubmit(evaluationReport)} label="Submit Evaluation" color="black" primary />
                    </Box>
                </Box>
            </Layer>
        </Fragment>
    );
};