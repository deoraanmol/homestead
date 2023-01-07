import React, { Fragment } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Task } from './Task';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm';
import { AboutHomestead } from './AboutHomestead';
import { Grommet, Spinner, Box, Text } from 'grommet';
import { NavbarFieldAgent } from './navbars/NavbarFieldAgent';
import { NavbarPreLogin } from './NavbarPreLogin';
import { Route, Routes } from 'react-router-dom';
import { TasksWrapper } from './TasksWrapper';
import { ManagePropertyDealers } from './ManagePropertyDealers';
import { Loading } from './Loading';
import { NavbarPropertyAdvisor } from './NavbarPropertyAdvisor';
import { NavbarPropertyEvaluator } from './navbars/NavbarPropertyEvaluator';
import { ManagePropertyApprovals } from './workflow-managers/ManagePropertyApprovals';
import { ManagePostProperties } from './workflow-managers/ManagePostProperties';
import { ManagePropertyEvaluations } from './workflow-managers/ManagePropertyEvaluations';


export const App = () => {
  const user = useTracker(() => Meteor.user());
  const isLoggingIn = useTracker(() => Meteor.loggingIn());
  const theme = {
    global: {
      font: {
        family: "Roboto",
        size: "18px",
        height: "20px",
      },
    },
  };

  let postLoginComponent;
  switch (user?.profile?.type) {
    case "FieldAgent":
      postLoginComponent = <NavbarFieldAgent user={user} />;
      break;
    case "PropertyAdvisor":
      postLoginComponent = <NavbarPropertyAdvisor user={user} />;
      break;
    case "PropertyEvaluator":
      postLoginComponent = <NavbarPropertyEvaluator user={user} />;
      break;
  }

  return (
    <Grommet full theme={theme}>
      <header>
        <div>
          {
            user ?
              (
                <Fragment>
                  {postLoginComponent}
                </Fragment>
              ) :
              (
                isLoggingIn ? (<Fragment />) : (<NavbarPreLogin />)
              )
          }
        </div>
      </header>

      <div className="main">
        {user ?
          (
            <Fragment>
              <Routes>
                <Route path='/' element={<TasksWrapper />} />
                <Route path="/about" element={<AboutHomestead />} />
                <Route path="/manage-property-dealers" element={<ManagePropertyDealers user={user} />} />
                <Route path="/manage-property-postings" element={<ManagePostProperties user={user} />} />
                <Route path="/approve-properties" element={<ManagePropertyApprovals user={user} />} />
                <Route path="/evaluate-properties" element={<ManagePropertyEvaluations user={user} />} />
              </Routes>
            </Fragment>
          ) :
          (
            isLoggingIn ?
              <Box margin={{ vertical: "20%" }} justify='center' align='center'><Loading /></Box> :
              (<Box margin={{ vertical: "10rem" }} justify='center' align='center'><LoginForm /></Box>)
          )}
      </div>
    </Grommet>
  );
};