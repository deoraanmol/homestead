import { Text, Box, Button, Layer, NameValueList, NameValuePair, FormField, TextInput } from "grommet";
import { Close } from "grommet-icons";
import { isEmpty } from "lodash";
import React, { Fragment, useEffect, useState } from "react";
import { ImagesSlideShow } from "../multimedia/ImagesSlideShow";

export const ReviewProperty = ({ clickedProperty, onReview, onClose, reviewLabel, showReject = false, onReject = undefined }) => {
    const [remarks, setRemarks] = useState("");
    const [isFormValid, setIsFormValid] = useState(0);
    useEffect(() => {
        if (!showReject) {
            setIsFormValid(1);
        } else {
            if (!isEmpty(remarks)) {
                setIsFormValid(1);
            } else {
                setIsFormValid(0);
            }
        }
    }, [remarks, showReject]);
    return (
        <Fragment>
            <Layer
                position="center"
                onEsc={onClose}
                animate="false"
                onClickOutside={onClose}
            >
                <Box margin="medium" style={{ height: "80vh" }}>
                    <Box as="header" direction="row" align="center" elevation="none" justify="between">
                        <Text margin={{ left: 'small' }}>{onReject ? "Review" : "Evaluate"} Property ({clickedProperty._id})</Text>
                        <Button onClick={onClose} style={{ boxShadow: "none" }}><Close /></Button>
                    </Box>
                    <Box flex overflow="auto" pad="small" style={{ fontSize: "10px !important" }}>
                        <Box flex="grow" overflow="auto" pad={{ vertical: 'medium' }}>
                            <Box>
                                <NameValueList layout="grid" pairProps={{ direction: 'column' }}>
                                    <NameValuePair key="images" name="Images">
                                        <Box align="center">
                                            <ImagesSlideShow height="300px" width="300px" images={clickedProperty.multimediaImages} />
                                        </Box>
                                    </NameValuePair>
                                    <NameValuePair key="name" name="Name" height="20px"><Text>{clickedProperty.name}</Text></NameValuePair>
                                    <NameValuePair key="location" name="Location"><Text>{clickedProperty.location}</Text></NameValuePair>
                                    <NameValuePair key="postedBy" name="Last Posted By"><Text>{clickedProperty.postedBy}</Text></NameValuePair>
                                    {clickedProperty.currentStatus !== "PENDING" &&
                                        <NameValuePair key="evaluatedAt" name="Evaluated At"><Text>{clickedProperty.evaluatedAt.toLocaleString()}</Text></NameValuePair>}
                                    {clickedProperty.currentStatus !== "PENDING" &&
                                        <NameValuePair key="evaluatedBy" name="Evaluated By"><Text>{clickedProperty.evaluator}</Text></NameValuePair>}
                                    {clickedProperty.currentStatus !== "PENDING" &&
                                        clickedProperty.evaluationReport.map(
                                            (report, idx) =>
                                                <NameValuePair key={`report-${idx}`} name={report.question}><Text>{report.rating}</Text></NameValuePair>
                                        )
                                    }
                                    {showReject && (
                                        <FormField label="Remarks by City Manager">
                                            <TextInput onChange={(e) => setRemarks(e.target.value)} value={remarks} />
                                        </FormField>
                                    )}
                                </NameValueList>
                            </Box>
                        </Box>
                        <Box as="footer" align="center" direction="row" justify="around">
                            <Button type="submit" onClick={showReject ? () => onReview(remarks) : onReview} label={reviewLabel} color="black" disabled={!isFormValid} primary />
                            {showReject && <Button type="submit" onClick={() => onReject(remarks)} label="Reject" color="black" disabled={!isFormValid} />}
                        </Box>
                    </Box>
                </Box>
            </Layer>
        </Fragment>
    );
};