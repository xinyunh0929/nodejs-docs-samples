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

// [START quickstart]

// Imports the Google APIs client library
const {google} = require('googleapis');
const discoveryDoc = '/usr/local/google/home/xinyunh/discovery/talent_public_discovery_v3_distrib.json';
// const discoveryDoc = '/usr/local/google/home/xinyunh/discovery/20180515-job-discovery-v2-discovery-doc.json';
const key = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const projectId = process.env.GOOGLE_CLOUD_PROJECT;
const jwtClient = new google.auth.JWT(key.client_email, null, key.private_key, ["https://www.googleapis.com/auth/jobs"], null);

var jobServicePromise = google.discoverAPI(discoveryDoc);
jobServicePromise.then(function(jobService){

    jwtClient.authorize(function(err, tokens) {
        if (err) {
            console.log(err);
            return;
        }

        console.log("tokens:", tokens);

        const request = {
          parent: `projects/${projectId}`,
          oauth_token: tokens.access_token
        };

        jobService.projects.companies.list(request, function (err, result) {
            if (err) {
                console.error('Failed to retrieve companies! ' + err);
                throw err;
            }
            console.log("############# GET sample #############");
            console.log('Companies:', result.data);
        });
    });
});

// Acquires credentials
// google.auth.getApplicationDefault((err, authClient) => {
//   if (err) {
//     console.error('Failed to acquire credentials');
//     console.error(err);
//     return;
//   }

//   if (authClient.createScopedRequired && authClient.createScopedRequired()) {
//     authClient = authClient.createScoped([
//       'https://www.googleapis.com/auth/jobs'
//     ]);
//   }

//   // Instantiates an authorized client
//   // const jobs = google.jobs({
//   //   version: 'v2',
//   //   auth: authClient
//   // });
//   const jobServicePromise = google.discoverAPI(discoveryDoc);
//   jobServicePromise.then(function(jobs){
//     const request = {
//       parent: `projects/${projectId}`
//     };

//     // Lists companies
//     jobs.companies.list((err, result) => {
//       if (err) {
//         console.error(err);
//         return;
//       }

//       console.log(`Request ID: ${result.data.metadata.requestId}`);

//       const companies = result.data.companies || [];

//       if (companies.length) {
//         console.log('Companies:');
//         companies.forEach((company) => console.log(company.name));
//       } else {
//         console.log(`No companies found.`);
//       }
//     });
//   });
// });
// [END quickstart]
