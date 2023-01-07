import { DataTable, Text, Box, Meter } from "grommet";
import React, { Fragment } from "react";
import { isEmpty } from "lodash";

export const ManageUsersTable = ({ users }) => {
    return (
        <Fragment>
            {
                isEmpty(users) ?
                    <Box justify="center" align="center" margin={{ vertical: "5rem" }}><Text color="gray">No users found!</Text></Box> :
                    <DataTable
                        columns={[
                            {
                                property: '_id',
                                header: <Text>User ID</Text>,
                                primary: true,
                            },
                            {
                                property: 'username',
                                header: <Text>Username</Text>,
                            },
                            {
                                property: 'profile.type',
                                header: <Text>User Type</Text>,
                            },
                        ]}
                        data={users}
                        step={10}
                        paginate={true}
                    />
            }
        </Fragment>
    );
};