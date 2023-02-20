import { Server } from '@hocuspocus/server'

const server = Server.configure({
  port: 80,
})

server.listen()

