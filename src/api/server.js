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
