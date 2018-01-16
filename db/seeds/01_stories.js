let sentencer = require('sentencer')
let hipsterIpsum = require('hipsteripsum');
/*
Sentencer.configure({
  // the list of nouns to use. Sentencer provides its own if you don't have one!
  nounList: [],

  // the list of adjectives to use. Again, Sentencer comes with one!
  adjectiveList: [],
})
*/

function pickOne(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function headline () {
  return sentencer.make(`{{ noun }} defensestrates {{ noun }}`)
}

function content () {
  return hipsterIpsum.get(1)
}

function author () {
  return 'Anonymous'
}

function oneRow () {
  return { 
    headline: headline(),
    content: content(),
    author: author()
  }
}

function makeSeeds(int) {
  let seed = []
  for (let i = 0; i < int; i++) {
    seed = [...seed, oneRow()]
  }
  return seed
}


exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('stories').del()
    .then(() => {
      return knex.raw(`SELECT setval('stories_id_seq', '1', 'false');`)
    })
    .then(() => {
      // Inserts seed entries
      return knex('stories').insert(makeSeeds(5));
    })
}
