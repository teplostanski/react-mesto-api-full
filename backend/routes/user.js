const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers, getUserById, getCurrentUserInfo, updateUserInfo, updateAvatar,
} = require('../controllers/user');
const regExp = require('../utils/regexp');

router.get('/', getUsers);
router.get('/me', getCurrentUserInfo);
router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({ userId: Joi.string().length(24).hex().required() }).unknown(true),
  }),
  getUserById,
);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }).unknown(true),
  }),
  updateUserInfo,
);
router.patch(
  '/me/avatar',
  celebrate(
    {
      body: Joi.object().keys({
        avatar: Joi.string().pattern(regExp).required(),
      }).unknown(true),
    },
  ),
  updateAvatar,
);

module.exports = router;
