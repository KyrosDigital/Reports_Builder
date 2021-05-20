import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";

Meteor.methods({

	Create_Account: function() {

	},

	Create_Editor_User: function() {

	},

	Create_Viewer_User: function() {

	},

	Modify_Viewer_User_Profile: function() {
		
  },
  
  Get_User_Role: function(userId) {
    console.log('this gets called at least')
    var user = Roles.getRolesForUser(userId)
    console.log("user :", user)
    console.log("role: ", user[0])
    return user[0]
  }

})