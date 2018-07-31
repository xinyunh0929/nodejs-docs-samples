/**
 * Copyright 2018, Google, LLC.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// Imports the Google APIs client library
const {google} = require('googleapis');
const uuidv1 = require('uuid/v1');
const discoveryDoc = '/usr/local/google/home/xinyunh/discovery/talent_public_discovery_v3_distrib.json';
const key = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const projectId = process.env.GOOGLE_CLOUD_PROJECT;
const jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, ["https://www.googleapis.com/auth/jobs"], null);
const parent = `projects/${projectId}`

// [START basic_company]
/**
 * Generate data for a company.
 * @returns {Object} Object containing fields of 'Company' resource.
 */
function generateCompany () {
  var company = {
    displayName: 'Google',
    external_id: 'company:' + uuidv1(),
    headquarters_address: '1600 Amphitheatre Parkway Mountain View, CA 94043'
  };
  console.log('Company generated:', company);
  return company;
}
// [END basic_company]

// [START create_company]
function createCompany (client, company, parent, token) {
  client.projects.companies.create({
      parent: parent,
      oauth_token: token,
      resource: {company: company}
    }, function (err, result) {
        if (err) {
            console.error('Failed to create company! ' + err);
            throw err;
        }
        console.log('Company created:', result.data);
        getCompany(client, result.data.name, token);
    });
}
// [END create_company]

// [START get_company]
function getCompany (client, companyName, token) {
  client.projects.companies.get({
      name: companyName,
      oauth_token: token,
    }, function (err, result) {
        if (err) {
            console.error('Failed to create company! ' + err);
            throw err;
        }
        console.log('Company existed:', result.data);
        var job = generateJob(companyName);
        createJob(client, job, parent, token);
    });
}
// [END get_company]

// [START basic_job]
function generateJob (companyName) {
  var job = {
    requisitionId: 'jobWithRequiredFields:' + uuidv1(),
    title: 'System administrator',
    description: 'Maintain IT network.',
    companyName: companyName,
    applicationInfo: {uris: ['https://www.foobar.com']}
  };
  console.log('Job generated:', job);
  return job;
}
// [END basic_job]

// [START create_job]
function createJob (client, job, parent, token) {
  client.projects.jobs.create({
      parent: parent,
      oauth_token: token,
      resource: {job: job}
    }, function (err, result) {
        if (err) {
            console.error('Failed to create job! ' + err);
            throw err;
        }
        console.log('Job created:', result.data);
        getJob(client, result.data.name, token);
    });
}
// [END create_job]

// [START get_job]
function getJob (client, jobName, token) {
  client.projects.jobs.get({
      name: jobName,
      oauth_token: token,
    }, function (err, result) {
        if (err) {
            console.error('Failed to get job! ' + err);
            throw err;
        }
        console.log('Job existed:', result.data);
        setTimeout(function() {basicKeywordSearch(client, [result.data.companyName], 'System administrator', token)}, 10000);
    });
}
// [END get_job]

// [START basic_keyword_search]
function basicKeywordSearch (client, companyNames, query, token) {
  const jobQuery = {
    companyNames: companyNames,
    query: query
  };
  const searchRequestMetadata = {
    user_id: 'HashedUserId',
    session_id: 'HashedSessionID',
    domain: 'www.google.com'
  };
  client.projects.jobs.search({
      parent: parent,
      oauth_token: token,
      resource: {
        request_metadata: searchRequestMetadata,
        jobQuery: jobQuery,
        searchMode: 'JOB_SEARCH'
      }
    }, function (err, result) {
        if (err) {
            console.error('Failed to search jobs! ' + err);
            throw err;
        }
        console.log('Search results:', result.data);
    });
}
// [END basic_keyword_search]


var jobServicePromise = google.discoverAPI(discoveryDoc);
jobServicePromise.then(function(jobService){

    jwtClient.authorize(function(err, tokens) {
        if (err) {
            console.log(err);
            return;
        }

        const companyToBeInserted =  generateCompany()
        createCompany(jobService, companyToBeInserted, parent, tokens.access_token);
    });
});
