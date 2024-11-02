import ActivityRole from '../database/Models/ActivityRole';
import { User, Role, UserRole } from '../database/Models';
import Activity from '../database/Models/Activity';
import jwt, { JwtPayload } from 'jsonwebtoken';

class CheckAuthorizationMiddleware {
    private activityCode: string;
    static handle: any;

    constructor(activityCode: string) {
        this.activityCode = activityCode;
        this.handle = this.handle.bind(this);
    }

    private isJwtPayload(decoded: string | JwtPayload): decoded is JwtPayload {
        return typeof decoded !== 'string' && 'userId' in decoded;
    }

    async handle(req: any, res: any, next: any) {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'No token provided' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
            console.log(decoded);
            if (!this.isJwtPayload(decoded)) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            const userId = decoded.userId;
            req.body.authUser = userId;

            const userRoles = await UserRole.findAll({
                where: { user_id: userId },
                include: [{ model: Role }]
            });

            const roleIds = userRoles.map(role => role.role_id);

            const activity = await Activity.findOne({ where: { code: this.activityCode } });
            if (!activity) {
                return res.status(404).json({ message: 'Activity not found' });
            }

            const activityRoles = await ActivityRole.findAll({
                where: { activity_id: activity.id, role_id: roleIds }
            });

            if (activityRoles.length === 0) {
                return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this activity' });
            }

            next();
        } catch (error) {
            console.log(error);
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Token has expired. Please login again' });
            }
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }
}

export default CheckAuthorizationMiddleware;
