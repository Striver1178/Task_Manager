const { verifyAccessToken } = require('../utils/jwt');
const { query } = require('../db/pool');

const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Access token required' });

    const decoded = verifyAccessToken(header.split(' ')[1]);
    const { rows } = await query(
      'SELECT id, name, email, role, avatar FROM users WHERE id = $1',
      [decoded.id]
    );
    if (!rows[0]) return res.status(401).json({ error: 'User not found' });

    req.user = rows[0];
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError')
      return res.status(401).json({ error: 'Token expired', code: 'TOKEN_EXPIRED' });
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Admin access required' });
  next();
};

const requireProjectAccess = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id;
    if (!projectId) return next();

    const { rows: [project] } = await query('SELECT * FROM projects WHERE id = $1', [projectId]);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const { rows: [member] } = await query(
      'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, req.user.id]
    );

    if (!member && project.owner_id !== req.user.id && req.user.role !== 'ADMIN')
      return res.status(403).json({ error: 'Access denied to this project' });

    req.project = project;
    req.membership = member;
    next();
  } catch (err) { next(err); }
};

const requireProjectAdmin = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.params.id;
    const { rows: [project] } = await query('SELECT * FROM projects WHERE id = $1', [projectId]);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const { rows: [member] } = await query(
      'SELECT * FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, req.user.id]
    );

    const isOwner       = project.owner_id === req.user.id;
    const isGlobalAdmin = req.user.role === 'ADMIN';
    const isProjAdmin   = member?.role === 'ADMIN';

    if (!isOwner && !isGlobalAdmin && !isProjAdmin)
      return res.status(403).json({ error: 'Project admin access required' });

    req.project = project;
    next();
  } catch (err) { next(err); }
};

module.exports = { authenticate, requireAdmin, requireProjectAccess, requireProjectAdmin };
