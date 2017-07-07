const fs = require('fs')
const mkdirp = require('mkdirp-promise')
const path = require('path')
const yaml = require('js-yaml')

const sourceDir = path.join(__dirname, 'data')
const outputDir = path.join(__dirname, 'out')

const users = fs.readdirSync(sourceDir)

function getMessagesForRepo (repoPath, user, repo) {
  let messages = []

  return new Promise((resolve, reject) => {
    fs.readdir(repoPath, (err, messageFiles) => {
      messageFiles.forEach(message => {
        const messagePath = path.join(repoPath, message)

        try {
          const file = fs.readFile(messagePath, 'utf8', (err, content) => {
            messages.push(yaml.safeLoad(content, 'utf8'))

            if (messages.length === messageFiles.length) {
              resolve(messages)
            }
          })
        } catch (e) {
          return reject(e)
        }
      })
    })
  })
}

function processRepo (repositoryPath, username, repository) {
  return getMessagesForRepo(repositoryPath, username, repository).then(messages => {
    const payload = {
      username,
      repository,
      messages
    }
    const outputPath = path.join(outputDir, username)

    return mkdirp(outputPath).then(() => {
      const filePath = path.join(outputPath, `${repository}.json`)

      return writeFile(filePath, JSON.stringify(payload))
    })
  })
}

function writeFile (path, content) {
  return new Promise((resolve, reject) => {
    console.log('* Writing:', path)

    fs.writeFile(path, content, err => {
      if (err) return reject(err)

      resolve()
    })
  })
}

users.forEach(username => {
  const userDir = path.join(sourceDir, username)

  fs.stat(userDir, (err, stats) => {
    if (err) return

    if (stats.isDirectory()) {
      fs.readdir(userDir, (err, repositories) => {
        if (err) return

        repositories.forEach(repository => {
          const repositoryDir = path.join(userDir, repository)
          fs.stat(repositoryDir, (err, stats) => {
            if (stats.isDirectory()) {
              processRepo(repositoryDir, username, repository).then(messages => {
                console.log('Done')
              })
            }
          })
        })
      })
    }
  })
})