var express   = require('express');
var router    = express.Router();
var crypto    = require('crypto')     // for password 암호화
var models    = require('../models')  // data models link

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
// register
router.post('/register', async function (req, res, next) {
  try {
    let body = req.body
    let inputPassword = body.password;
    let salt = Math.round((new Date().valueOf() * Math.random())) + "";
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
    body.password = hashPassword
    console.log('cryted password:',hashPassword)
    body.salt = salt
    const user = await models.User.create(body);
    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
});
// login
router.post('/login', async function (req, res, next) {
  try {
    let result = await models.User.findOne({
      where: {
        userId: req.body.userId
      }
    });
    console.log(result.dataValues)
    let dbPassword = result.dataValues.password;
    let inputPassword = req.body.password;
    let salt = result.dataValues.salt;
    let hashPassword = crypto.createHash("sha512").update(inputPassword + salt).digest("hex");
    if (dbPassword === hashPassword) {
      // redis server 를 활용한 아이디 중복 체크
      // req.session.user = req.body.userId;
      // console.log('req.sessionStore:', req.sessionStore.all)
      // req.sessionStore.all((_, session) => {
      //   console.log('session:', session)
      //   session.forEach(e => {
      //     if (e.user && e.user === req.body.userId && e.id !== req.sessionID) {
      //       req.sessionStore.destroy(e.id);
      //     }
      //   })
      // })
      return res.status(200).json({ info: '로그인 되었습니다!' })
    } else {
      return res.status(400).json({ error: '아이디 혹은 비밀번호가 일치하지 않습니다.' })
    }
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
});
// me data
router.get('/me/:id', async function (req, res, next) {
  try {
    const id = req.params.id
    const me = await models.User.findOne({ where: { id } });
    return res.status(200).json({
      me,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
});
router.get("/logout", function (req, res, next) {
  // redis server 사용해서 중복체크할 경우 아래 코드 사용
  // req.sessionStore.destroy(req.sessionID, error => {/* redis 오류로 인한 에러 핸들링 */ });
  // req.session.destroy();
  res.clearCookie('accessToekn');
  return res.status(200).json({ info: '로그아웃 되었습니다.' });
})
// 유저 정보 수정
router.put('/:id', async function (req, res, next) {
  try {
    const body = req.body
    const id = req.body.id
    const user = await models.User.update(body, { where: { id: id } });
    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
});
router.delete('/:id', async function (req, res, next) {
  try {
    const id = req.params.id
    const user = await models.User.destroy({ where: { id } });
    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
});
// 비밀번호 재설정
router.put('/reset-password', async function (req, res, next) {
  try {
    const body = req.body
    const userId = req.body.id
    const userSearch = await models.User.findOne({ where: { id: userId } });
    const inputPassword = req.body.password
    let hashPassword = crypto.createHash("sha512").update(inputPassword + userSearch.dataValues.salt).digest("hex");
    body.password = hashPassword
    const user = await models.User.update(body, { where: { id: userId } });
    return res.status(200).json({
      user,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
});

module.exports = router;
