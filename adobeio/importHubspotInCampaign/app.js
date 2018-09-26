"use strict"

// Dependencies
var request = require('request');
var https = require('https');
var jwt = require('jwt-simple');

//https://adobeioruntime.net/api/v1/web/beneluxbootcamp/team1/importHubspotIntoCampaign

 var getAllAccounts = function() {
    console.log('Fetching all CRM account on Hubspot');

   var promise = new Promise(function(resolve, reject){
      
        var options = {
            host: 'adobeioruntime.net',
            port: 443,
            path: 'api/v1/web/beneluxbootcamp/team1/getAllHubspotEmails',
            method: 'GET',
            url: 'https://adobeioruntime.net/api/v1/web/beneluxbootcamp/team1/getAllHubspotEmails'
        };
        request.get(options, function (error, response, body) {
            if (error) {
                console.log('error getting emails fron Hubspot through Adobe IO');
                console.log(error);
                reject(error);
            } else {
                var emails = JSON.parse(body)['emails'];
                resolve({emails: emails});

            }
        });

   });
   return promise;
};

var getAccountDetail = function(email) {
    console.log('Fetching details for '+email);
   var promise = new Promise(function(resolve, reject){
      
        var options = {
            host: 'adobeioruntime.net',
            port: 443,
            path: 'api/v1/web/beneluxbootcamp/team1/getDetailsByEmail?email='+email,
            method: 'GET',
            url: 'https://adobeioruntime.net/api/v1/web/beneluxbootcamp/team1/getDetailsByEmail?email='+email
        };
        request.get(options, function (error, response, body) {
            if (error) {
                console.log('error getting account detail for '+email);
                console.log(error);
                reject(error);
            } else {
                var contact = JSON.parse(body)['contact'];
                resolve({contact: contact});

            }
        });

   });
   return promise;
};

var createAcsProfile = function(contact) {
     console.log('Creating account for '+contact['contact']['email']);
   var promise = new Promise(function(resolve, reject){

    var messageString = JSON.stringify(contact);
      
        var options = {
            host: 'adobeioruntime.net',
            port: 443,
            path: 'api/v1/web/beneluxbootcamp/team1/createAcsAccount',
            method: 'POST',
            url: 'https://adobeioruntime.net/api/v1/web/beneluxbootcamp/team1/createAcsAccount',
            body: messageString,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        request.post(options, function (error, response, body) {
            if (error) {
                console.log('error getting account detail for '+contact['contact']['email']);
                console.log(error);
                reject(error);
            } else {
                resolve(body);

            }
        });

   });
   return promise;
};

function main(params) {
    console.log('Starting Hubspot to campaign import');

    return new Promise(function (resolve, reject) {

            getAllAccounts().then(function(emails){
            var allContacts = [];
            var fetched = 0;
            for(var i = 0; i < emails['emails'].length; i++){

                getAccountDetail(emails['emails'][i]).then(function(contact){
                    allContacts.push(contact);
                    fetched++;

                    // UGLY HACK
                    if(fetched >= emails['emails'].length){

                        console.log('all details fetched');

                        var imported = 0;

                        // UGLY HACK
                        for(var j = 0; j < allContacts.length; j++){

                            createAcsProfile(allContacts[j]).then(function(){
                                imported++;

                                // UGLY HACK
                                if(imported >= allContacts.length){

                                    console.log('all accounts created');

                                    var txt = 'Created following accounts:\n';
                                    for(var k = 0; k < allContacts.length; k++){
                                        txt = txt + allContacts[k]['contact']['email'] + '\n';
                                    }

                                    resolve({
                                       headers: {
                                            'Content-Type': 'text/plain'
                                        },
                                        statusCode: 200,
                                        body: txt
                                    });

                                }
                            });
                        }

                   }
                }); 

            }           

            
        });      

    })   

}

exports.main = main;