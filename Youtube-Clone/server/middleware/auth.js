const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET || 'devsecret'

function auth(req, res, next) {
  const h = req.headers.authorization || ''
  if (!h.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' })
  const token = h.slice(7)
  try {
    const payload = jwt.verify(token, secret)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = auth
