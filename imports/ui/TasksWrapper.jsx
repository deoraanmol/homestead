import React, { Fragment } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { TaskForm } from './TaskForm';
import { Task } from './Task';
import { TasksCollection } from '/imports/api/TasksCollection';


export const TasksWrapper = () => {
    const user = useTracker(() => Meteor.user());
    const tasks = useTracker(() => TasksCollection.find({}, { sort: { createdAt: -1 } }).fetch());
    const toggleChecked = ({ _id, isChecked }) => {
        TasksCollection.update(_id, {
            $set: {
                isChecked: !isChecked
            }
        })
    };
    const deleteTask = ({ _id }) => TasksCollection.remove(_id);
    return (
        <Fragment>
            <TaskForm user={user} />
            <ul className="tasks">
                {tasks.map(task => (
                    <Task
                        key={task._id}
                        task={task}
                        onCheckboxClick={toggleChecked}
                        onDeleteClick={deleteTask}
                    />
                ))}
            </ul>
        </Fragment>
    );
}