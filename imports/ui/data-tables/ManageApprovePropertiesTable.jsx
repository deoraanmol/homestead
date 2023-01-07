import { DataTable, Text, Box } from "grommet";
import React, { Fragment } from "react";
import { isEmpty, cloneDeep } from "lodash";
import { ReviewProperty } from "../review-popups/ReviewProperty";
import { PropertiesCollection } from '/imports/api/PropertiesCollection';

export const ManageApprovePropertiesTable = ({ userProperties, user }) => {
    const [show, setShow] = React.useState(false);
    const [clickedProperty, setClickedProperty] = React.useState({});
    const onClose = () => setShow(false);
    const onApprove = (remarks) => {
        setShow(false);
        clickedProperty.statusTrail.push({ approvedAt: { date: new Date(), actor: user.username } })
        PropertiesCollection.update(
            { _id: clickedProperty._id },
            {
                $set: {
                    currentStatus: "APPROVED",
                    approvedAt: new Date(),
                    cityManager: user.username,
                    cityManagerRemarks: remarks,
                    statusTrail: clickedProperty.statusTrail,
                    isLive: true
                }
            });
    }
    const onReject = (remarks) => {
        setShow(false);
        clickedProperty.statusTrail.push({ rejectedAt: { date: new Date(), actor: user.username } })
        PropertiesCollection.update(
            { _id: clickedProperty._id },
            {
                $set: {
                    currentStatus: "REJECTED",
                    rejectedAt: new Date(),
                    cityManagerRemarks: remarks,
                    cityManager: user.username,
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
                    showReject
                    onReview={clickedProperty.currentStatus === "APPROVED" ? onClose : onApprove}
                    onReject={onReject}
                    reviewLabel={clickedProperty.currentStatus === "APPROVED" ? "Close" : "Approve"}
                />)
            }
        </Fragment>
    );
};