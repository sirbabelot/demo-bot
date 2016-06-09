"use strict";
/**
 * @fileoverview This file stores the configuration object required for
 *     Stately.js. It represents the state machine that composes the bot.
 */
var regex = require('./regex.js');
var STATES = require('./states.json');
var State = require('./State.js');

var room_price, room_num;

function getResponsesByKeys(responses) {
  return responses.map(response => STATES[response]);
}

module.exports = {
  "GREETING": new State({
    onEnter: function() {
      return ['GREETING', JSON.stringify(['HEY_THERE','GREETING']) ]
    },
    onInput: function(message) {
      if (message.search(regex.yes) >= 0) {
        return ['GROUP_MYSELF', JSON.stringify(['GROUP_MYSELF'])];
      } else if (message.search(regex.no) >= 0) {
        return ['NO_HELP', JSON.stringify(['NO_HELP'])];
      } else if (message.search(regex.faq) >= 0) {
        return ['FAQ', JSON.stringify(['HELP'])];
      } else {
        return ['GREETING', JSON.stringify(['I_DONT_UNDERSTAND', 'GREETING']) ];
      }
    }
  }),
  "GROUP_MYSELF": new State({
    onEnter: function() {
    },
    onInput: function(message) {
      if (message === 'group') {
        return ['NUM_OF_ROOMS', JSON.stringify(['NUM_OF_ROOMS']) ]
      } else if (message === 'by myself') {
        return ['SUBLET_ENTIRE', JSON.stringify(['SUBLET_ENTIRE']) ]
      } else {
        return ['GROUP_MYSELF', JSON.stringify(['I_DONT_UNDERSTAND', 'GROUP_MYSELF'])];
      }
    }
  }),
  "SUBLET_ENTIRE": new State({
    onEnter: function() {
    },
    onInput: function(message) {
      if (message === 'sublet' || message === 'full lease') {
        return ['MAX_PRICE', JSON.stringify(['MAX_PRICE'])]
      } else {
        return ['SUBLET_ENTIRE', JSON.stringify(['I_DONT_UNDERSTAND', 'SUBLET_ENTIRE'])];
      }
    }
  }),
  "NUM_OF_ROOMS": new State({
    onEnter: function() {
    },
    onInput: function(message) {
      var matches = message.match(regex.num_range);
      if (matches && matches.length > 0) {
        room_num = matches[0];
        return ['MAX_PRICE', JSON.stringify(['MAX_PRICE'])]
      }
      else { return ['NUM_OF_ROOMS', JSON.stringify(['I_DONT_UNDERSTAND', 'NUM_OF_ROOMS'])]; }
    }
  }),
  "MAX_PRICE": new State({
    onEnter: function() {
    },
    onInput: function(message) {

      var matches = message.match(regex.price);
      if (matches && matches.length > 0) {
        room_price = matches[0];
        return ['ANYTHING_ELSE', JSON.stringify(['ANYTHING_ELSE'])];
      } else {
        return ['MAX_PRICE', JSON.stringify(['I_DONT_UNDERSTAND', 'MAX_PRICE']) ];
      }
    }
  }),
  "ANYTHING_ELSE": new State({
    onEnter: function() {
    },
    onInput: function(message) {
      // anything_else = message;
      // var newStr = STATES.LOOK_INTO_IT
      //   .replace('{room_num}', room_num)
      //   .replace('{room_price}', room_price);
      return ['LOOK_INTO_IT', JSON.stringify(['LOOK_INTO_IT', 'RESULT']) ]
    }
  }),
  "LOOK_INTO_IT": new State({
    onEnter: function() {
      return ['YOU_AGAIN', JSON.stringify(['YOU_AGAIN']) ]
    },
    onInput: function(message) {
    }
  }),
  "YOU_AGAIN": new State({
    onEnter: function() {
    },
    onInput: function(message) {
      if (message.search(regex.yes) >= 0) {
        return ['GROUP_MYSELF', JSON.stringify(['GROUP_MYSELF']) ];
      } else if (message.search(regex.no) >= 0) {
        return ['NO_HELP', JSON.stringify(['NO_HELP'])];
      } else {
        return ['YOU_AGAIN', JSON.stringify(['I_DONT_UNDERSTAND', 'YOU_AGAIN'])];
      }
    }
  }),
  "NO_HELP": new State({
    onEnter: function() {
    },
    onInput: function(message) {
      return ['YOU_AGAIN', JSON.stringify(['YOU_AGAIN']) ]
    }
  }),
  "FAQ": new State({
    onEnter: function(){

    },
    onInput: function(message){
      if (message.search(regex.viewing) >= 0) {
        return ['FAQ', JSON.stringify(['VIEWING','MORE_HELP'])];
      } else if (message.search(regex.deposit) >= 0) {
        return ['FAQ', JSON.stringify(['SECURITY_DEPOSIT',, 'MORE_HELP'])];
      } else if (message.search(regex.pet) >= 0) {
        return ['FAQ', JSON.stringify(['PET_FRIENDLY',, 'MORE_HELP'])];
      } else if (message.search(regex.utilities) >= 0) {
        return ['FAQ', JSON.stringify(['UTILITIES', 'MORE_HELP'])];
      }else if (message.search(regex.no) >= 0) {
        return ['NO_HELP', JSON.stringify(['NO_HELP'])];
      }else{
        return ['FAQ', JSON.stringify(['I_DONT_UNDERSTAND', 'FAQ']) ];
      }
    }
  })
};
