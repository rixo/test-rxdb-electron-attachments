const assert = require('assert')
const { create, plugin } = require('rxdb')

const fooSchema = {
  version: 0,
  properties: {
    name: {
      type: 'string',
    },
  },
  attachments: {},
}

plugin(require(`pouchdb-adapter-idb`))
plugin(require(`pouchdb-adapter-memory`))

async function testAttachments(adapter) {
  let db

  try {
    db = await create({
      name: 'test_' + String(Math.random()).substr(2),
      adapter: 'idb',
      adapter: 'memory',
      adapter,
    })

    assert(!!db, 'db created')

    await db.collection({
      name: 'foo',
      schema: fooSchema,
    })

    // insert
    {
      db.foo.insert({
        name: 'bar',
      })
    }

    // putAttachment
    {
      const doc = await db.foo.findOne({ name: 'bar' }).exec()
      assert(doc.name === 'bar', 'record loaded')

      await doc.putAttachment({
        id: 'attached',
        data: 'Lorem ipsum dolor sit amet',
        type: 'text/plain',
      })
    }

    {
      const doc = await db.foo.findOne({ name: 'bar' }).exec()
      assert(doc.name === 'bar', 'record loaded')

      const attachments = doc.allAttachments()
      assert(attachments.length === 1)

      const attachment = await doc.getAttachment('attached')
      const value = await attachment.getStringData()

      assert(value === 'Lorem ipsum dolor sit amet')
    }

    console.log(`${adapter}: OK`)
  } finally {
    if (db) {
      await db.remove()
    }
  }
}

function run(adapters) {
  adapters.forEach(adapter => {
    testAttachments(adapter).catch(err => {
      console.log(`${adapter}: FAILED`)
      console.error(err)
    })
  })
}

module.exports = run
