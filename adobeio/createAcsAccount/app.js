"use strict"

// Dependencies
var request = require('request');
var https = require('https');
var jwt = require('jwt-simple');

//https://adobeioruntime.net/api/v1/web/beneluxbootcamp/team1/importHubspotIntoCampaign

var getAcsToken = function() {
    console.log('Getting Adobe Campaign access token');
   var promise = new Promise(function(resolve, reject){
        var url = 'https://ims-na1.adobelogin.com/ims/exchange/jwt/';
        var clientID = 'de43b0eb195a483d883117fe549ff2da';
        var clientSecret = 'd20442dd-f3ef-42c8-b78c-9adde3e63f29';
        var campaignIMSEndpoint = 'https://ims-na1.adobelogin.com/s/ent_campaign_sdk';
        var campaignPEM = '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDmFaoF8yw+Hlwg\nECWwlVOBCFaz0PH1tJ+J/aJLCru6oXxTRsgXp6id7K3vUJ0UIQdDhVYfKo6vVbMO\n0jgwis8qpQUnMpPn+lGmiRuM1SjDIWLosn8ZJLggN+9KCa19+OhKGVLWdew7WQWR\nYrBlGZYYN8HWDCecaXSCuDvC887BEZmnnhId9x58KtnUAcLegjXeA375WAMJvPLo\nHBZtHA8WokiHtJg7DT/+sEAcm10z9dKFjFeIs2lNP6wD9j8ZnjwmSsL7/HKWSZs1\n9XjGVYrS+1YvZIJVAVAv9PgojVZrHIeCPBWWSPMNIsCSdUNWqohJ8hkRgzNKlrg4\n1pk4VWP9AgMBAAECggEAJyi0wUJ72y6rm0FkSMOBbMqQhxYeuCS/qmqifocbIE5v\nrHS1hWEhj49CoyJjOZPNeq5s0+0YT7sUOIeKzKgzThy73cn75lVyJBfduoBk6aD7\nBoOqogrf04vxi/ZNssz0K/hXYuy7AfbKvc3AG9TY+NI0iUuUSkigbccRVMLOA4m6\nsgUi6H4TvDiGLq4V5aCtDSA289DndWUwQJklRfqSW8vO7UGgR4IHW0KND3qCJukY\nE71/u0HGnkLq5NB9LhW401LpwVMMy7XnS7Rx8UHe0X3R9k1afde5Q+9l13j9nLW4\n5deazIlLUT0RO9mbuloJo71EbqsP0eDh51TnEtSwOQKBgQDz/V0Rvt66DMst6YpH\nDVDm8C0dmYg0MRPqMKDXuM1avc/hYJxLGPYk1a1lBCrnylTNXsDv83/iYjXYzdOB\nMLBiNg40ibT7wM+2pBDrqDj9eB1PGvldCp273oPnqgpwNqNQwuYzt7IDNCeQNEhv\nVb7uIxELZ7SwxIivJcZbn1gX7wKBgQDxaRNmDgIfzbKzUxK2t5DRBa2GaskrMifq\n4oGVHQ+sE3V6oxDUbbskliuQdPF/+80ErGGoGtXvHd0LFNMN/0NY7XFGJN5YD8G1\nKUlFJhpY21WpteucA4KVkLn2lcPTqsfDOFLiR4Vzh9Dyj8bXfj2J9As771Ct1ZaZ\n8Fen9eb20wKBgQC26j8XyqxXdrfr16We1tDMEUsBYdTGq/RuIb6zewwY9ywdnrwN\nYM1HmBnCHXm9A+bHgD3MphQ9t7r+qm/h7oqNVlEX+hUAl/Ag0KcOxLLU83OllmdT\n5V2TNqJUzxm8Pnn5VeQW6aQ+2p6+cTPMo8/b39YrYrgHvY9rHzqx/aehaQKBgEfJ\nFxuhzr/mSt1INqherZF6Pr9Zwbg2kegmsqHEooRoxOZS1w5UEvIuNYYfQDDuj2h0\nWhXC5RrVpoVFC/19imlHMgfJrtRA2zkjrcYCLpN9pVtx3T3nTU1sW+AXaMPoZL6I\nYR0oZ2aTXG7EkjxCLcp3519LKpKGkOH1thsb5DJBAoGBAO/3iBruHpGnYlqJD8NY\na5KbSjaEetLEZVhaU2gVWmaYaN7u5YG8MLQemULmA38XQ6L2fceQyTY9+9H83dW8\nylR5r9hAn8htewzHEqCg9b5nIJmTYRr71+zjkUIzwBsjuf86spjbsCol8vrE70nf\nuX3mDY6fugqXK9dkzkTEOVse\n-----END PRIVATE KEY-----';
        // generate JWT Token
        var jwtPayload = {
            "exp": Math.round(87000 + Date.now() / 1000),
            "iss": '2AD0BA3F597F539A0A495CC5@AdobeOrg',
            "sub": '66AA2D7F5B97D25B0A495E78@techacct.adobe.com',
            "aud": 'https://ims-na1.adobelogin.com/c/' + clientID
        };
        jwtPayload[campaignIMSEndpoint] = true;
        var JWTToken = jwt.encode(jwtPayload, campaignPEM, 'RS256');

        var formData = {
            client_id: clientID,
            client_secret: clientSecret,
            jwt_token: JWTToken
        };
        request.post({
                url: url,
                formData: formData
            }, function optionalCallback(err, httpResponse, body) {
                if (err) {
                    reject(err);
                } else {
                    var result = JSON.parse(body);
                    var accessToken = "Bearer " + result.access_token;
                    console.log("Get Bearer token success");
                    
                    resolve({accessToken: accessToken});
                }
            });

   });
   return promise;
};

var createAcsProfile = function(contact,accessToken) {
    console.log('Creating ACS profile for '+contact['email']);
   var promise = new Promise(function(resolve, reject){

    var clientID = 'de43b0eb195a483d883117fe549ff2da';
      
        var jsonObj = {};
            jsonObj.firstName = contact['firstname'];
            jsonObj.cusName = contact['firstname'];
            jsonObj.lastName = contact['lastname'];
            jsonObj.email = contact['email'];
            jsonObj.cusEmailadress = contact['email'];
            jsonObj.cusChristmasbuyer = contact['christmasBuyer'];
            jsonObj.cusCompanyname = contact['companyName'];
            jsonObj.cusCompanytype = contact['companyType'];
            jsonObj.cusNrofemployees = contact['numberofemployees'];
            jsonObj.cusCity = contact['city'];
        
        var messageString = JSON.stringify(jsonObj);

        console.log('payload: '+messageString);
        var options = {
            url: 'https://mc.adobe.io/adobedemoemea104.campaign-demo.adobe.com/campaign/profileAndServicesExt/profile/',
            body: messageString,
            method: 'POST',
            headers: {
                'x-api-key': clientID,
                authorization: accessToken
            }
        };

        request.post(options, function (error, response, body) {
            if (error) {
                console.log('Error creating acs account for '+contact['email']);
                console.log(error);
                reject(error);
            } else {
                console.log(body);
                resolve();

            }
        });

   });
   return promise;
};

function main(params) {
    var contact = params.contact;
    console.log('Creating ACS account for '+contact['email']);

    return new Promise(function (resolve, reject) {

        var acsToken;

        getAcsToken().then(function(token){

            var jwtToken = token['accessToken'];
            

            createAcsProfile(contact, jwtToken).then(function(){
                resolve({
                   headers: {
                        'Content-Type': 'text/plain'
                    },
                    statusCode: 200,
                    body: 'Account '+contact['email']+' created'
                });
            });

        });        

    })   

}

exports.main = main;