/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
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

const functions = require('firebase-functions')
const { dialogflow } = require('actions-on-google')

const app = dialogflow()

app.intent('Default Welcome Intent', conv => {
  conv.ask('Welcome to my agent!')
})

app.intent('Default Fallback Intent', conv => {
  conv.ask(`I didn't understand`)
  conv.ask(`I'm sorry, can you try again?`)
})

app.intent('name', conv => {
  conv.ask('My name is Acronis!')
})

// Fulfillment for handling 'language' or 'ProgrammingLanguage' entities of the user input:
app.intent('Languages', (conv, {language, ProgrammingLanguage}) => {
    if (language) {
        conv.ask(`Wow! I didn't know you knew ${language}`);
        conv.contexts.set('Languages-followup', 2, {language: language});
    } else if (ProgrammingLanguage) {
        conv.ask(`${ProgrammingLanguage} is cool.`);
        conv.contexts.set('Languages-followup', 2, {ProgrammingLanguage: ProgrammingLanguage});
    } else {
        conv.ask(`What language do you know ?`);
    }
});

// Retrieving the context on fulfillments:
app.intent('Languages - custom', (conv, {duration}) => {
    const langContext: any = conv.contexts.get('languages-followup');
    const language: any = langContext.parameters.language || langContext.parameters.ProgrammingLanguage;
    conv.ask(`I can't believe you've know ${language} for ${duration.amount} ${duration.unit}`);
});

exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app)