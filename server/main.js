import { Meteor } from 'meteor/meteor';
import { TasksCollection } from '/imports/api/TasksCollection';
import { PropertiesCollection } from '/imports/api/PropertiesCollection';
import { Accounts } from 'meteor/accounts-base';
import { getRandomUser } from './utils';


const insertTask = (taskText, user) =>
  TasksCollection.insert({
    text: taskText,
    userId: user._id,
    createdAt: new Date(),
  });


const seededUsers = [
  { username: "field-agent-admin", password: 'password', type: 'FieldAgent' },
  { username: "property-advisor-admin", password: 'password', type: 'PropertyAdvisor' },
  { username: "property-evaluator-admin", password: 'password', type: 'PropertyEvaluator' }
];

const SEED_USERNAME = 'meteorite';

Meteor.startup(() => {
  seededUsers.map((seedUser) => {
    if (!Accounts.findUserByUsername(seedUser.username)) {
      Accounts.createUser({
        username: seedUser.username,
        password: seedUser.password,
        profile: {
          type: seedUser.type
        }
      });
    }
  })
  const user = Accounts.findUserByUsername(SEED_USERNAME);
  if (TasksCollection.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task'
    ].forEach(taskText => insertTask(taskText, user));
  }
});

Meteor.methods({
  'users/create': function ({ username, password, userType }) {
    const newUser = { username, password, profile: { type: userType } };
    return Accounts.createUser(newUser);
  },
  'properties/post': function ({ name, location, postedBy, multimediaImages }) {
    const postedAt = new Date();
    // todo anmol - add extra logic to pickup random evaluator from a specific location
    const allEvaluators = Meteor.users.find({ "profile.type": "PropertyEvaluator" }).fetch();
    return PropertiesCollection.insert({
      name,
      location,
      postedBy,
      multimediaImages,
      postedAt,
      currentStatus: 'PENDING',
      statusTrail: [{ postedAt: { date: postedAt, actor: postedBy } }],
      evaluator: getRandomUser(allEvaluators).username
    })
  },
  'properties/put': function ({ _id, name, location, multimediaImages, postedBy, statusTrail }) {
    const lastUpdatedAt = new Date();
    statusTrail.push({ updatedAt: { date: lastUpdatedAt, actor: postedBy } });
    return PropertiesCollection.update({ _id }, {
      $set: {
        name,
        location,
        multimediaImages,
        lastUpdatedAt,
        currentStatus: 'PENDING',
        statusTrail: statusTrail
      }
    });
  }
})