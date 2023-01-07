import React, { Fragment } from "react";
import { useTracker } from 'meteor/react-meteor-data';
import { Box } from "grommet";
import { Navigate } from "react-router-dom";
import { SubMenu } from "../navbars/SubMenu";
import { PropertiesCollection } from '/imports/api/PropertiesCollection';
import { ManageApprovePropertiesTable } from "../data-tables/ManageApprovePropertiesTable";

export const ManagePropertyApprovals = ({ user }) => {
    const userProperties = useTracker(() => PropertiesCollection.find({ currentStatus: { $in: ["EVALUATED", "APPROVED", "REJECTED"] } }, { sort: { evaluatedAt: -1 } }).fetch());
    if (user.profile.type !== "PropertyAdvisor") {
        return <Navigate to="/about" replace />;
    }
    return (
        <Fragment>
            <SubMenu labels={["Properties", "Review Postings"]} />
            <Box fill margin={{ top: "5rem" }}>
                <ManageApprovePropertiesTable userProperties={userProperties} user={user} />
            </Box>
        </Fragment >
    );
};