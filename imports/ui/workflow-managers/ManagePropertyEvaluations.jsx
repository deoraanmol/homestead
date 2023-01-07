import React, { Fragment } from "react";
import { useTracker } from 'meteor/react-meteor-data';
import { Box } from "grommet";
import { Navigate } from "react-router-dom";
import { SubMenu } from "../navbars/SubMenu";
import { PropertiesCollection } from '/imports/api/PropertiesCollection';
import { ManageEvaluatePropertiesTable } from "../data-tables/ManageEvaluatePropertiesTable";

export const ManagePropertyEvaluations = ({ user }) => {
    const userProperties = useTracker(() => PropertiesCollection.find({ evaluator: user.username }, { sort: { postedAt: -1 } }).fetch());
    if (user.profile.type !== "PropertyEvaluator") {
        return <Navigate to="/about" replace />;
    }
    return (
        <Fragment>
            <SubMenu labels={["Properties", "Evaluate Properties"]} />
            <Box fill margin={{ top: "5rem" }}>
                <ManageEvaluatePropertiesTable userProperties={userProperties} />
            </Box>
        </Fragment >
    );
};