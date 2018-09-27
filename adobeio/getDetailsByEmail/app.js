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

    var email = params.email;
    var apikey = "1c1c8d8d-c9ed-4015-872d-720aa008407a";
    var url = 'https://api.hubapi.com/contacts/v1/contact/email/'+email+'/profile?hapikey='+apikey;

    console.log('URL: '+url);

    var options = {
        host: 'api.hubapi.com',
        port: 443,
        path: 'contacts/v1/contact/email/'+email+'/profile?hapikey='+apikey,
        method: 'GET',
        url: url
    };

    return new Promise(function (resolve, reject) {

        request.get(options, function (error, response, body) {
            if (error) {
                console.log('error for '+email);
                console.log(error);
                reject(error);
            } else {
                console.log('response for '+email);

                var jsonBody = JSON.parse(body);
                var contactProperties = jsonBody['properties'];
                var associatedCompany = jsonBody['associated-company'];

                var firstname = contactProperties['firstname'].value;
                var lastname = '';
                if(contactProperties['lastname']){
                    lastname = contactProperties['lastname'].value;
                }
                var job = '';
                if(contactProperties['jobtitle']){
                    job = contactProperties['jobtitle'].value;
                }
                var christmasBuyer = '';
                if(contactProperties['christmas_buyer']){
                    christmasBuyer = contactProperties['christmas_buyer'].value;
                }

                var restaurantType = '';
                if(associatedCompany['properties']['industry']){
                    restaurantType = associatedCompany['properties']['industry'].value;
                }
                var companyName = associatedCompany['properties']['name'].value;
                var companyType = associatedCompany['properties']['company_type'].value;
                var city = '';
                if(associatedCompany['properties']['city']){
                    city = associatedCompany['properties']['city'].value;
                }
                //if(associatedCompany['properties']['country']){
                //    restaurantAddress = restaurantAddress+associatedCompany['properties']['country'].value;
                //}
                var numberofemployees = '';
                if(associatedCompany['properties']['numberofemployees']){
                    numberofemployees = associatedCompany['properties']['numberofemployees'].value;
                }

                var owner = true;

                var crmid = Math.floor(Math.random() * 101);

                var jsonObj = new Object();
                jsonObj.firstname = firstname;
                jsonObj.lastname = lastname;
                jsonObj.email = email;
                jsonObj.job = job;
                jsonObj.christmasBuyer = christmasBuyer;
                jsonObj.companyName = companyName;
                jsonObj.companyType = companyType;
                jsonObj.city = city;
                jsonObj.numberofemployees = numberofemployees;
                jsonObj.crmid = crmid;

                console.log(jsonObj);

                var jsonArg2 = new Object();
                jsonArg2.contact = jsonObj;


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

