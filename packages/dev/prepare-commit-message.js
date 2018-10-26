const fs = require('fs')

const [
  messageFile,
  commitType,
  commitHash
] = process.env.GIT_PARAMS.split(' ')

if (commitType == null) {
  const currentMessage = fs.readFileSync(messageFile)
  const newMessage = fs.readFileSync('.github/.git_commit_msg.txt')
  fs.writeFileSync(messageFile, newMessage)
  fs.appendFileSync(messageFile, currentMessage)
}
