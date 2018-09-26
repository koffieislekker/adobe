"use strict"

// Dependencies
var request = require('request');
var https = require('https');

/**
 * This Adobe IO runtime function creates a contact in Hubspot and return a vid
 * API key is cc20872a-3077-442f-94fb-f1f11bae2f89
 * @param params Input object
 * @returns {Promise}
 */

function main(params) {

//https://adobeioruntime.net/api/v1/web/beneluxbootcamp/team1/hubspot    

    var method = params.__ow_method;
    var apikey = "1c1c8d8d-c9ed-4015-872d-720aa008407a";
    var emailParam = params.email;
    var firstnameParam = params.firstname;
    var lastnameParam = params.lastname;
    var property = {};
    var value = {};
    var properties = [];
    var url = 'https://api.hubapi.com/contacts/v1/lists/all/contacts/all?hapikey=' + apikey;

    console.log('URL: '+url);

    // set options for POST request
    var options = {
        host: 'api.hubapi.com',
        port: 443,
        path: 'contacts/v1/lists/all/contacts/all?hapikey=' + apikey,
        method: 'GET',
        url: url
    };

    return new Promise(function (resolve, reject) {

        request.get(options, function (error, response, body) {
            if (error) {
                console.log('error');
                console.log(error);
                reject(error);
            } else {
                console.log('response');

                var contacts = JSON.parse(body).contacts;

                var emails = [];

                for(var i = 0; i < contacts.length; i++){
                    var email = contacts[i]['identity-profiles'][0].identities[0].value;
                    emails.push(email);
                    //getContactThingy(contacts[i]).then(function(value){console.log('resolved worked I think '+value)});
                }

                var jsonArg2 = new Object();
                jsonArg2.emails = JSON.stringify(emails);
                console.log(jsonArg2);

                resolve({
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    statusCode: 200,
                    body: jsonArg2
                });

            }
        });

    })   
}

exports.main = main;
