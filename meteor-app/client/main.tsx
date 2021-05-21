import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Main_Router } from '/imports/api/router/router'

Meteor.startup(() => {
  render(<Main_Router />, document.getElementById('react-target'));
});
