import { rest } from 'msw'
import { db } from './db'
import { nanoid } from '@reduxjs/toolkit'
import { parseISO } from 'date-fns'
import seedrandom from 'seedrandom'
import faker from 'faker'
import { Server as MockSocketServer } from 'mock-socket'

let rng = seedrandom()

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(rng() * (max - min + 1)) + min
}

const randomFromArray = (array) => {
  const index = getRandomInt(0, array.length - 1)
  return array[index]
}

const notificationTemplates = [
  'poked you',
  'says hi!',
  `is glad we're friends`,
  'sent you a gift',
]

export const handlers = [
  rest.get('/posts', function (req, res, ctx) {
    return res(ctx.json({ posts: db.post.getAll() }))
  }),
  rest.post('/posts', function (req, res, ctx) {
    const data = req.body
    data.date = new Date().toISOString()
    // Work around some odd behavior by Mirage that's causing an extra
    // user entry to be created unexpectedly when we only supply a userId.
    // It really want an entire Model passed in as data.user for some reason.
    const user = db.user.findFirst({ where: { id: { equals: data.userId } } })
    data.user = user

    if (data.content === 'error') {
      throw new Error('Could not save the post!')
    }

    const result = db.post.create(data)
    return res(ctx.json(result))
  }),
  rest.patch('/posts/:postId', (req, res, ctx) => {
    const {
      post: { id, ...data },
    } = req.body
    const updatedPost = db.post.update({
      where: { id: { equals: req.params.postId } },
      data,
    })
    return res(ctx.json(updatedPost))
  }),

  rest.get('/posts/:postId/comments', (req, res, ctx) => {
    const post = db.post.findFirst({
      where: { id: { equals: req.params.postId } },
    })
    return res(ctx.json({ comments: post.comments }))
  }),

  rest.post('/posts/:postId/reactions', (req, res, ctx) => {
    const postId = req.params.postId
    const reaction = req.body.reaction
    const post = db.post.findFirst({
      where: { id: { equals: postId } },
    })

    const updatedPost = db.post.update({
      where: { id: { equals: postId } },
      data: {
        reactions: {
          ...post.reactions,
          [reaction]: (post.reactions[reaction] += 1),
        },
      },
    })

    return res(ctx.json(updatedPost))
  }),
  rest.get('/notifications', (req, res, ctx) => {
    const numNotifications = getRandomInt(1, 5)

    let pastDate

    const now = new Date()

    const since = req.url.searchParams.get('since')

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
        date: faker.date.between(pastDate, now).toISOString(),
        message: template,
        user: user.id,
        read: false,
        isNew: true,
      }
    })

    return res(ctx.json({ notifications }))
  }),
  rest.get('/users', (req, res, ctx) => {
    return res(ctx.json({ users: db.user.getAll() }))
  }),
  ...db.user.toHandlers(),
  ...db.post.toHandlers(),
  ...db.comment.toHandlers(),
]

const socketServer = new MockSocketServer('ws://localhost')

let currentSocket

const sendMessage = (socket, obj) => {
  socket.send(JSON.stringify(obj))
}

const sendRandomNotifications = (socket, since) => {
  const numNotifications = getRandomInt(1, 5)

  const notifications = generateRandomNotifications(since, numNotifications, db)

  sendMessage(socket, { type: 'notifications', payload: notifications })
}

export const forceGenerateNotifications = (since) => {
  sendRandomNotifications(currentSocket, since)
}

socketServer.on('connection', (socket) => {
  currentSocket = socket

  socket.on('message', (data) => {
    const message = JSON.parse(data)

    switch (message.type) {
      case 'hello': {
        sendMessage({ type: 'response', payload: 'hi!' })
        break
      }
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

function generateRandomNotifications(since, numNotifications, db) {
  const now = new Date()
  let pastDate

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
      date: faker.date.between(pastDate, now).toISOString(),
      message: template,
      user: user.id,
      read: false,
      isNew: true,
    }
  })

  return notifications
}
