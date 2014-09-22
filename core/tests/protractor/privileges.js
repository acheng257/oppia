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
 * @fileoverview End-to-end tests of user editing and viewing rights.
 *
 * @author Jacob Davis (jacobdavis11@gmail.com)
 */

var users = require('../protractor_utils/users.js');
var workflow = require('../protractor_utils/workflow.js');

describe('Appointing roles', function() {
  it('should award correct permissions to collaborators', function() {
    users.createUser('alice@example.com', 'Alice');
    users.createUser('bob@example.com', 'Bob');
    users.createUser('eve@example.com', 'Eve');

    users.login('alice@example.com');
    workflow.createExploration('message', 'secrets');
    workflow.addExplorationCollaborator('bob@example.com');
    expect(workflow.getExplorationManagers()).toEqual(['Alice']);
    expect(workflow.getExplorationCollaborators()).toEqual(['Bob']);
    expect(workflow.getExplorationPlaytesters()).toEqual([]);
    general.getExplorationIdFromEditor().then(function(explorationId) {
      users.logout();

      users.login('bob@example.com');
      general.openEditor(explorationId);
      editor.editContent().open();
      editor.editContent().appendPlainText('I love you');
      editor.editContent().close();
      editor.saveChanges();
      users.logout();

      users.login('eve@example.com');
      general.openEditor(explorationId);
      general.expect404Error();
      users.logout();
    });
  });
});