import { DataTable, Text, Box, Button, Layer, NameValueList, NameValuePair } from "grommet";
import React, { Fragment } from "react";
import { isEmpty, cloneDeep } from "lodash";
import { toBase64List } from "../../utils/image_utils";
import { EvaluatePropertyLayer } from "../review-popups/EvaluatePropertyLayer";
import { ReviewProperty } from "../review-popups/ReviewProperty";
import { PropertiesCollection } from '/imports/api/PropertiesCollection';

export const ManageEvaluatePropertiesTable = ({ userProperties }) => {
    const [show, setShow] = React.useState(false);
    const [showEvalReport, setShowEvalReport] = React.useState(false);
    const [clickedProperty, setClickedProperty] = React.useState({});
    const startEvaluation = () => setShowEvalReport(true);
    const closeEvaluation = () => setShow(false);
    const onSubmitEvaluation = (report) => {
        setShowEvalReport(false);
        setShow(false);
        clickedProperty.statusTrail.push({ evaluatedAt: { date: new Date(), actor: clickedProperty.evaluator } })
        PropertiesCollection.update(
            { _id: clickedProperty._id },
            {
                $set: {
                    evaluationReport: report,
                    currentStatus: "EVALUATED",
                    evaluatedAt: new Date(),
                    statusTrail: clickedProperty.statusTrail
                }
            });
    }
    return (
        <Fragment>
            {
                isEmpty(userProperties) ?
                    <Box justify="center" align="center" margin={{ vertical: "5rem" }}><Text color="gray">No properties posted yet!</Text></Box> :
                    <DataTable
                        columns={[
                            { property: "_id", header: "ID", primary: true },
                            { property: "name", header: "Name" },
                            { property: "location", header: "Location" },
                            { property: "postedBy", header: "Posted By" },
                            { property: "currentStatus", header: "Status" },
                        ]}
                        data={userProperties}
                        step={10}
                        paginate={true}
                        onClickRow={(event) => {
                            const clonedRow = cloneDeep(event.datum);
                            setShow(true);
                            setClickedProperty(clonedRow);
                        }}
                    />
            }
            {!isEmpty(userProperties) && show &&
                (<ReviewProperty clickedProperty={clickedProperty} onClose={() => setShow(false)}
                    onReview={clickedProperty.currentStatus === "EVALUATED" ? closeEvaluation : startEvaluation}
                    reviewLabel={clickedProperty.currentStatus === "EVALUATED" ? "Close" : "Start Evaluation"}
                />)
            }
            {!isEmpty(userProperties) && showEvalReport &&
                (<EvaluatePropertyLayer propertyId={clickedProperty._id} onClose={() => setShowEvalReport(false)} onSubmit={onSubmitEvaluation} />)
            }
        </Fragment>
    );
};