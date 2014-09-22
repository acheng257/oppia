// Copyright 2014 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Utilities for exploration creation, publication ect. when
 * carrrying out end-to-end testing with protractor.
 *
 * @author Jacob Davis (jacobdavis11@gmail.com)
 */

forms = require('./forms.js');
editor = require('./editor.js');

// Creates an exploration and opens its editor.
var createExploration = function(name, category) {
  browser.get('/gallery');
  element(by.css('.protractor-test-create-exploration')).click();
  element(by.model('newExplorationTitle')).sendKeys(name);
  forms.editAutocompleteDropdown(element(by.tagName('select2-dropdown'))).
    setText(category);
  element(by.css('.select2-container')).click();
  element(by.css('.select2-input')).sendKeys(category + '\n');
  element(by.buttonText('Add New Exploration')).click();

  // We now want to wait for the editor to fully load.
  protractor.getInstance().waitForAngular();
};

// Functions run from the state editor.

// This will only work if all changes have been saved and there are no 
// outstanding warnings.
var publishExploration = function() {
  element(by.css('.protractor-test-publish-exploration')).click();
  element(by.css('.protractor-test-confirm-publish')).click();
};

// roleName here is the user-visible form.
var _addExplorationRole = function(roleName, email) {
  editor.runFromSettingsTab(function() {
    element(by.css('.protractor-test-edit-roles')).click();
    element(by.css('.protractor-test-role-email')).sendKeys(email);
    element(by.css('.protractor-test-role-select')).element(by.cssContainingText('option', roleName)).click();
    element(by.css('.protractor-test-save-role')).click();
  });
};

var addExplorationManager = function(email) {
  _addExplorationRole('Manager', email);
};

var addExplorationCollaborator = function(email) {
  _addExplorationRole('Collaborator', email);
};

var addExplorationPlaytester = function(email) {
  _addExplorationRole('Playtester', email);
};

// roleName here is the server-side form.
var _getExplorationRoles = function(roleName) {
  var result = editor.runFromSettingsTab(function() {
    return element.all(by.repeater(
        roleName + 'Name in explorationRightsService.' + roleName +
          'Names track by $index')).map(function(elem) {
      return elem.getText();
    }); 
  });
  return result;
};

var getExplorationManagers = function() {
  return _getExplorationRoles('owner');
};

var getExplorationCollaborators = function() {
  return _getExplorationRoles('editor');
};

var getExplorationPlaytesters = function() {
  return _getExplorationRoles('viewer');
};

exports.createExploration = createExploration;
exports.publishExploration = publishExploration;

exports.addExplorationManager = addExplorationManager;
exports.addExplorationCollaborator = addExplorationCollaborator;
exports.addExplorationPlaytester = addExplorationPlaytester;
exports.getExplorationManagers = getExplorationManagers;
exports.getExplorationCollaborators = getExplorationCollaborators;
exports.getExplorationPlaytesters = getExplorationPlaytesters;