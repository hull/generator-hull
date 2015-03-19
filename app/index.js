'use strict';
var path = require('path');
var fs = require('fs');
var superb = require('superb');
var normalizeUrl = require('normalize-url');
var humanizeUrl = require('humanize-url');
var yeoman = require('yeoman-generator');
var templates= [
	'.editorconfig',
	'.eslintrc',
	'.gitattributes',
	'.gitignore',
	'.travis.yml',
	'config.js',
	'gulpfile.js',
	'license',
	'manifest.json',
	'readme.md',
	'webpack.config.js'
];



module.exports = yeoman.generators.Base.extend({
	init: function () {
		var cb = this.async();

		this.prompt([{
			name: 'moduleName',
			message: 'What do you want to name your ship? (We will prepend "hull-")',
			default: 'hull-'+this.appname.replace(/\s/g, '-').replace(/$hull-/,''),
			filter: function (val) {
				return this._.slugify(val);
			}.bind(this)
		}, {
			name: 'shipName',
			message: 'Choose a Display Name for the Ship',
			validate: function (val) {
				return val.length > 0 ? true : 'You have to provide an Ship Display Name';
			}
		}, {
			name: 'orgUrl',
			message: 'What is your Organization URL?',
			validate: function (val) {
				return val.length > 0 ? true : 'You have to provide an org URL';
			}
		}, {
			name: 'platformId',
			message: 'What is the Platform ID?',
			validate: function (val) {
				return val.length > 0 ? true : 'You have to provide an platform Id. You can create one on http://dashboard.hullapp.io';
			}
		}, {
			name: 'githubUsername',
			message: 'What is your GitHub username?',
			validate: function (val) {
				return val.length > 0 ? true : 'You have to provide a username';
			}
		}, {
			name: 'website',
			message: 'What is the URL of your Ship?',
			validate: function (val) {
				return val.length > 0 ? true : 'You have to provide a Ship URL. You can use Github Pages. Then whitelist this url in your Hull Platform';
			},
			filter: function (val) {
				return normalizeUrl(val);
			}
		}], function (props) {
			this.moduleName = props.moduleName;
			this.camelModuleName = this._.camelize(props.moduleName);
			this.shipName = props.shipName;
			this.githubUsername = props.githubUsername || generator.config.get('githubUsername');
			this.platformId = props.platformId || generator.config.get('platformId') ;
			this.orgUrl = props.orgUrl || generator.config.get('orgUrl');
			generator.config.set({
				githubUsername:this.githubUsername,
				platformId: this.platformId,
				orgUrl: this.orgUrl
			})
			this.name = this.user.git.name();
			this.email = this.user.git.email();
			this.website = props.website;
			this.humanizedWebsite = humanizeUrl(this.website);
			this.superb = superb();
			for (var i = templates.length - 1; i >= 0; i--) {
				var template = templates[i];

				// Special Case;
				// needed so npm doesn't try to use it and fail
				if(template!='_package.json'){
					this.template(template);
				}
				this.directory('src');
			};
			this.template('_package.json', 'package.json');
			cb();
		}.bind(this));
	}
});
