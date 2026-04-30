const router = require('express').Router();
const { body } = require('express-validator');
const {
  getTasks, getTaskById, createTask, updateTask, updateTaskStatus,
  deleteTask, addComment, deleteComment,
} = require('../controllers/task.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validate.middleware');

router.use(authenticate);

router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/',
  [body('title').trim().isLength({ min: 2, max: 200 }),
   body('projectId').notEmpty(),
   body('status').optional().isIn(['TODO','IN_PROGRESS','IN_REVIEW','DONE']),
   body('priority').optional().isIn(['LOW','MEDIUM','HIGH','URGENT'])],
  validate, createTask);
router.put('/:id',
  [body('title').optional().trim().isLength({ min: 2 }),
   body('status').optional().isIn(['TODO','IN_PROGRESS','IN_REVIEW','DONE']),
   body('priority').optional().isIn(['LOW','MEDIUM','HIGH','URGENT'])],
  validate, updateTask);
router.patch('/:id/status',
  [body('status').isIn(['TODO','IN_PROGRESS','IN_REVIEW','DONE'])], validate, updateTaskStatus);
router.delete('/:id', deleteTask);
router.post('/:id/comments',
  [body('content').trim().isLength({ min: 1, max: 1000 })], validate, addComment);
router.delete('/:id/comments/:commentId', deleteComment);

module.exports = router;
