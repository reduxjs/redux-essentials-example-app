import {
  Server,
  Model,
  Factory,
  belongsTo,
  hasMany,
  association,
  RestSerializer,
} from 'miragejs'

import { nanoid } from '@reduxjs/toolkit'

import faker from 'faker'
import { sentence, paragraph, article } from 'txtgen'

const IdSerializer = RestSerializer.extend({
  serializeIds: 'always',
})

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
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

new Server({
  routes() {
    this.namespace = 'fakeApi'
    this.timing = 2000

    this.resource('users')
    this.resource('posts')
    this.resource('comments')

    const server = this

    this.post('/posts', function (schema, req) {
      const data = this.normalizedRequestAttrs()
      const result = server.create('post', data)
      return result
    })

    this.get('/posts/:postId/comments', (schema, req) => {
      const post = schema.posts.find(req.params.postId)
      return post.comments
    })

    this.get('/notifications', (schema, req) => {
      const numNotifications = 3

      const now = new Date()
      const past = new Date(now.valueOf())
      past.setMinutes(past.getMinutes() - 15)

      const notifications = [...Array(numNotifications)].map(() => {
        const user = randomFromArray(schema.db.users)
        const template = randomFromArray(notificationTemplates)
        return {
          id: nanoid(),
          date: faker.date.between(past, now).toISOString(),
          message: template,
          user: user.name,
          read: false,
        }
      })

      return { notifications }
    })
  },
  models: {
    user: Model.extend({
      posts: hasMany(),
    }),
    post: Model.extend({
      user: belongsTo(),
      comments: hasMany(),
    }),
    comment: Model.extend({
      post: belongsTo(),
    }),
    notification: Model.extend({}),
  },
  factories: {
    user: Factory.extend({
      id() {
        return nanoid()
      },
      firstName() {
        return faker.name.firstName()
      },
      lastName() {
        return faker.name.lastName()
      },
      name() {
        return faker.name.findName(this.firstName, this.lastName)
      },
      username() {
        return faker.internet.userName(this.firstName, this.lastName)
      },

      afterCreate(user, server) {
        server.createList('post', 3, { user })
      },
    }),
    post: Factory.extend({
      id() {
        return nanoid()
      },
      title() {
        return sentence()
      },
      date() {
        return faker.date.past(3)
      },
      content() {
        return article(1)
      },
      reactions() {
        return {
          thumbsUp: 0,
          hooray: 0,
          heart: 0,
          rocket: 0,
          eyes: 0,
        }
      },
      afterCreate(post, server) {
        //server.createList('comment', 3, { post })
      },

      user: association(),
    }),
    comment: Factory.extend({
      id() {
        return nanoid()
      },
      date() {
        return faker.date.past(2)
      },
      text() {
        return paragraph()
      },
      post: association(),
    }),
  },
  serializers: {
    user: IdSerializer,
    post: IdSerializer,
    comment: IdSerializer,
  },
  seeds(server) {
    server.createList('user', 3)
  },
})
