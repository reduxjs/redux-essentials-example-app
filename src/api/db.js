import { factory, oneOf, manyOf, primaryKey } from '@mswjs/data'
import { nanoid } from '@reduxjs/toolkit'
import faker from 'faker'
import seedrandom from 'seedrandom'
import { setRandom } from 'txtgen'

// Set up a seeded random number generator, so that we get
// a consistent set of users / entries each time the page loads.
// This can be reset by deleting this localStorage value,
// or turned off by setting `useSeededRNG` to false.
let useSeededRNG = true

let rng = seedrandom()

if (useSeededRNG) {
  let randomSeedString = localStorage.getItem('randomTimestampSeed')
  let seedDate

  if (randomSeedString) {
    seedDate = new Date(randomSeedString)
  } else {
    seedDate = new Date()
    randomSeedString = seedDate.toISOString()
    localStorage.setItem('randomTimestampSeed', randomSeedString)
  }

  rng = seedrandom(randomSeedString)
  setRandom(rng)
  faker.seed(seedDate.getTime())
}

export const db = factory({
  user: {
    id: primaryKey(() => faker.random.uuid()),
    firstName: String,
    lastName: String,
    name: String,
    username: String,
    posts: manyOf('post'),
  },
  post: {
    id: primaryKey(() => faker.random.uuid()),
    title: String,
    date: String,
    content: String,
    created_at: String,
    updated_at: String,
    reactions: oneOf('reaction'),
    comments: manyOf('comment'),
    user: oneOf('user'),
  },
  comment: {
    id: primaryKey(String),
    date: String,
    text: String,
    post: oneOf('post'),
  },
  reaction: {
    id: primaryKey(() => nanoid()),
    thumbsUp: Number,
    hooray: Number,
    heart: Number,
    rocket: Number,
    eyes: Number,
    post: oneOf('post'),
  },
})

const createUserData = () => {
  const firstName = faker.name.firstName()
  const lastName = faker.name.lastName()

  return {
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    username: faker.internet.userName(),
  }
}

const createPostData = (user) => {
  const usableDate = faker.date.past().toISOString()
  return {
    title: faker.lorem.words(),
    date: new Date().toISOString(),
    user,
    content: faker.lorem.paragraphs(),
    reactions: db.reaction.create(),
    created_at: usableDate,
    updated_at: usableDate,
  }
}

;[...new Array(3)].forEach((_) => db.user.create(createUserData()))
;[...new Array(3)].forEach((_, index) => {
  const author = db.user.findFirst({ take: 1, skip: index })
  const newPost = createPostData(author)
  db.post.create(newPost)
})
