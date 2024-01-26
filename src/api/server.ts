import { http, HttpResponse } from 'msw'
import { setupWorker } from 'msw/browser'
import { factory, oneOf, manyOf, primaryKey } from '@mswjs/data'
import { nanoid } from '@reduxjs/toolkit'
import { faker } from '@faker-js/faker'
import { Server as MockSocketServer, Client } from 'mock-socket'

import { parseISO } from 'date-fns'

const NUM_USERS = 3
const POSTS_PER_USER = 3
const RECENT_NOTIFICATIONS_DAYS = 7

// Add an extra delay to all endpoints, so loading spinners show up.
const ARTIFICIAL_DELAY_MS = 2000

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/* RNG setup */

// Set up a seeded random number generator, so that we get
// a consistent set of users / entries each time the page loads.
// This can be reset by deleting this localStorage value,
// or turned off by setting `useSeededRNG` to false.
let useSeededRNG = true

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

  faker.seed(seedDate.getTime())
}

function getRandomInt(min: number, max: number) {
  return faker.number.int({ min, max })
}

const randomFromArray = <T>(array: T[]) => {
  const index = getRandomInt(0, array.length - 1)
  return array[index]
}

const firstFromArray = <T>(items: T | T[] | readonly T[]) => {
  return ([] as T[]).concat(items)[0]
}

type ReactionName = 'thumbsUp' | 'hooray' | 'heart' | 'rocket' | 'eyes'

/* MSW Data Model Setup */

export const db = factory({
  user: {
    id: primaryKey(nanoid),
    firstName: String,
    lastName: String,
    name: String,
    username: String,
    posts: manyOf('post'),
  },
  post: {
    id: primaryKey(nanoid),
    title: String,
    date: String,
    content: String,
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
    id: primaryKey(nanoid),
    thumbsUp: Number,
    hooray: Number,
    heart: Number,
    rocket: Number,
    eyes: Number,
    post: oneOf('post'),
  },
})

type ModelDB = typeof db

type UserData = ReturnType<typeof createUserData>
type PostData = ReturnType<typeof createPostData>

type User = ReturnType<typeof db.user.create>
type Post = ReturnType<typeof db.post.create>

const createUserData = () => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    username: faker.internet.userName(),
  }
}

const createPostData = (user: User) => {
  return {
    title: faker.lorem.words(),
    date: faker.date.recent({ days: RECENT_NOTIFICATIONS_DAYS }).toISOString(),
    user,
    content: faker.lorem.paragraphs(),
    reactions: db.reaction.create(),
  }
}

// Create an initial set of users and posts
for (let i = 0; i < NUM_USERS; i++) {
  const author = db.user.create(createUserData())

  for (let j = 0; j < POSTS_PER_USER; j++) {
    const newPost = createPostData(author)
    db.post.create(newPost)
  }
}

const serializePost = (post: Post) => ({
  ...post,
  user: post.user!.id,
})

/* MSW REST API Handlers */

export const handlers = [
  http.get('/fakeApi/posts', async function () {
    const posts = db.post.getAll().map(serializePost)
    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(posts)
  }),
  http.post('/fakeApi/posts', async function ({ request }) {
    const data = (await request.json())! as Record<string, unknown>

    if ('content' in data && data.content === 'error') {
      await delay(ARTIFICIAL_DELAY_MS)

      return new HttpResponse(
        JSON.stringify('Server error saving this post!'),
        {
          status: 500,
        },
      )
    }

    data.date = new Date().toISOString()
    const userId = data.user as string

    const user = db.user.findFirst({ where: { id: { equals: userId } } })
    data.user = user
    data.reactions = db.reaction.create()

    const post = db.post.create(data)
    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(serializePost(post))
  }),
  http.get('/fakeApi/posts/:postId', async function ({ params }) {
    const postId = firstFromArray(params.postId)
    const post = db.post.findFirst({
      where: { id: { equals: postId } },
    })!
    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(serializePost(post))
  }),
  http.patch('/fakeApi/posts/:postId', async ({ request, params }) => {
    const { id, ...data } = (await request.json()) as Post
    const postId = firstFromArray(params.postId)
    const updatedPost = db.post.update({
      where: { id: { equals: postId } },
      data,
    })!
    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(serializePost(updatedPost))
  }),

  http.get('/fakeApi/posts/:postId/comments', async ({ params }) => {
    const postId = firstFromArray(params.postId)
    const post = db.post.findFirst({
      where: { id: { equals: postId } },
    })!

    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json({ comments: post.comments })
  }),

  http.post('/fakeApi/posts/:postId/reactions', async ({ request, params }) => {
    const postId = firstFromArray(params.postId)
    const { reaction } = (await request.json()) as { reaction: ReactionName }
    const post = db.post.findFirst({
      where: { id: { equals: postId } },
    })!

    const updatedPost = db.post.update({
      where: { id: { equals: postId } },
      data: {
        reactions: {
          ...post.reactions!,
          [reaction]: (post.reactions![reaction] += 1),
        },
      },
    })!

    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(serializePost(updatedPost))
  }),
  http.get('/fakeApi/notifications', async () => {
    const numNotifications = getRandomInt(1, 5)

    let notifications = generateRandomNotifications(
      undefined,
      numNotifications,
      db,
    )

    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(notifications)
  }),
  http.get('/fakeApi/users', async () => {
    await delay(ARTIFICIAL_DELAY_MS)
    return HttpResponse.json(db.user.getAll())
  }),
]

export const worker = setupWorker(...handlers)
// worker.printHandlers() // Optional: nice for debugging to see all available route handlers that will be intercepted

/* Mock Websocket Setup */

const socketServer = new MockSocketServer('ws://localhost')

let currentSocket: Client

const sendMessage = (socket: Client, obj: any) => {
  socket.send(JSON.stringify(obj))
}

// Allow our UI to fake the server pushing out some notifications over the websocket,
// as if other users were interacting with the system.
const sendRandomNotifications = (socket: Client, since: string) => {
  const numNotifications = getRandomInt(1, 5)

  const notifications = generateRandomNotifications(since, numNotifications, db)

  sendMessage(socket, { type: 'notifications', payload: notifications })
}

export const forceGenerateNotifications = (since: string) => {
  sendRandomNotifications(currentSocket, since)
}

socketServer.on('connection', socket => {
  currentSocket = socket

  socket.on('message', data => {
    const message = JSON.parse(data as string)

    switch (message.type) {
      case 'notifications': {
        const since = message.payload
        sendRandomNotifications(socket, since)
        break
      }
      default:
        break
    }
  })
})

/* Random Notifications Generation */

const notificationTemplates = [
  'poked you',
  'says hi!',
  `is glad we're friends`,
  'sent you a gift',
]

function generateRandomNotifications(
  since: string | undefined,
  numNotifications: number,
  db: ModelDB,
) {
  const now = new Date()
  let pastDate: Date

  if (since) {
    pastDate = parseISO(since)
  } else {
    pastDate = new Date(now.valueOf())
    pastDate.setMinutes(pastDate.getMinutes() - 15)
  }

  // Create N random notifications. We won't bother saving these
  // in the DB - just generate a new batch and return them.
  const notifications = [...Array(numNotifications)].map(() => {
    const user = randomFromArray(db.user.getAll())
    const template = randomFromArray(notificationTemplates)
    return {
      id: nanoid(),
      date: faker.date.between({ from: pastDate, to: now }).toISOString(),
      message: template,
      user: user.id,
    }
  })

  return notifications
}
